// utils/modelStorage.ts
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { IndikatorTypes } from '@/types';


// Daftarkan kelas Sequential untuk deserialisasi
tf.serialization.registerClass(tf.Sequential);
// Fungsi untuk menyimpan model ke database
export async function saveModelToDB(
    model: tf.Sequential,
    modelName: string,
    normalizationParams: any,
    indikator?: any
): Promise<{ success: boolean; message?: string }> {
    try {
        // 1. Simpan model sementara ke IndexedDB
        await model.save(`indexeddb://${modelName}_temp`);

        // 2. Bersihkan penyimpanan sementara
        await deleteModelFromIndexedDB(`${modelName}_temp`);

        // 3. Siapkan payload untuk API
        const payload = {
            indikator: indikator,
            model_name: modelName,
            model_json: model.toJSON(),
            normalization_params: JSON.stringify(normalizationParams),
        };

        // 4. Kirim ke backend Laravel
        const response = await axios.post(route('model.store'), payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return { success: true, message: 'Model saved successfully' };
    } catch (error) {
        console.error('Error saving model:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

// Fungsi untuk memuat model dari database
export async function loadModelFromDB(
    modelName: string
): Promise<{ indikator: IndikatorTypes[]; model: tf.Sequential; normalizationParams: any }> {
    try {
        // 1. Fetch model data from Laravel backend
        const response = await axios.get(route('model.show', { modelName: modelName }));
        const {indikator, model_json, normalization_params } = response.data;

        // 2. Parse the JSON strings
        const modelConfig = JSON.parse(model_json);
        const normParams = JSON.parse(normalization_params);

        // 3. Register the Sequential class for deserialization
        tf.serialization.registerClass(tf.Sequential);

        // 4. Reconstruct the model from JSON
        const model = await tf.models.modelFromJSON(modelConfig) as tf.Sequential;
        // 5. Return both the model and normalization parameters
        return { indikator,model, normalizationParams: normParams };
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to load model');
    }
}

// Fungsi untuk menghapus model dari IndexedDB
async function deleteModelFromIndexedDB(modelName: string): Promise<void> {
    try {
        const indexedDB = window.indexedDB;
        if (!indexedDB) {
            console.warn('IndexedDB not supported');
            return;
        }

        const request = indexedDB.deleteDatabase(`tensorflowjs_models/${modelName}`);

        request.onerror = () => {
            console.warn(`Failed to delete model ${modelName} from IndexedDB`);
        };

        request.onsuccess = () => {
            console.log(`Model ${modelName} deleted from IndexedDB`);
        };
    } catch (error) {
        console.warn(`Error deleting model from IndexedDB: ${error}`);
    }
}

