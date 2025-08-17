// components/train-models.tsx
import { Button } from '@/components/ui/button';
import { IndikatorTypes } from '@/types';
import { saveModelToDB } from '@/utils/modelstorage';
import * as tf from '@tensorflow/tfjs';
import { useState } from 'react';
import { Toast } from './ui/toast';

interface TrainModelsProps {
    indikator: IndikatorTypes[];
    transactionX: any[];
    transactionY: {
        eucheuma_conttoni_basah: number;
        eucheuma_conttoni_kering: number;
        eucheuma_spinosum_basah: number;
        eucheuma_spinosum_kering: number;
    }[];
    onModelsTrained: (
        models: {
            conttoniBasah: tf.Sequential;
            conttoniKering: tf.Sequential;
            spinosumBasah: tf.Sequential;
            spinosumKering: tf.Sequential;
        },
        normalizationParams: any,
    ) => void;
}

export default function TrainModels({ indikator, transactionX, transactionY, onModelsTrained }: TrainModelsProps) {
    const [errorModel, setErrorModel] = useState<{ text: string; status: boolean }>({ text: '', status: false });
    const [isErrorModel, setIsErrorModel] = useState<boolean>(false);

    const [training, setTraining] = useState(false);
    const [progress, setProgress] = useState({
        conttoniBasah: 0,
        conttoniKering: 0,
        spinosumBasah: 0,
        spinosumKering: 0,
    });

    const initModel = () => {
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [indikator.length] }));
        return model;
    };

    const normalize = (value: number, min: number, max: number) => {
        if (min === max) return 0;
        return Math.min(1, Math.max(0, (value - min) / (max - min)));
    };

    const trainAllModels = async () => {
        setTraining(true);
        try {
            // Hitung normalisasi untuk fitur input (sama untuk semua model)
            const featureRanges = indikator.map((_, i) => {
                const values = transactionX.map((point) => point[i]);
                return { min: Math.min(...values), max: Math.max(...values) };
            });

            const InputXs = transactionX.map((point) => indikator.map((_, i) => normalize(point[i], featureRanges[i].min, featureRanges[i].max)));

            // Inisialisasi 4 model
            const models = {
                conttoniBasah: initModel(),
                conttoniKering: initModel(),
                spinosumBasah: initModel(),
                spinosumKering: initModel(),
            };

            // Fungsi untuk melatih satu model
            const trainSingleModel = async (model: tf.Sequential, outputKey: keyof (typeof transactionY)[0], progressKey: keyof typeof progress) => {
                const outputValues = transactionY.map((point) => point[outputKey]);
                const outputMin = Math.min(...outputValues);
                const outputMax = Math.max(...outputValues);

                const ys = tf.tensor2d(transactionY.map((point) => [normalize(point[outputKey], outputMin, outputMax)]));

                model.compile({ optimizer: tf.train.adam(0.001), loss: 'meanSquaredError' });

                await model.fit(tf.tensor2d(InputXs), ys, {
                    epochs: 200,
                    batchSize: 32,
                    callbacks: {
                        onEpochEnd: (epoch, logs) => {
                            setProgress((prev) => ({
                                ...prev,
                                [progressKey]: ((epoch + 1) / 200) * 100,
                            }));
                        },
                    },
                });

                ys.dispose();
                return { outputMin, outputMax };
            };

            // Latih semua model secara paralel
            const [conttoniBasahParams, conttoniKeringParams, spinosumBasahParams, spinosumKeringParams] = await Promise.all([
                trainSingleModel(models.conttoniBasah, 'eucheuma_conttoni_basah', 'conttoniBasah'),
                trainSingleModel(models.conttoniKering, 'eucheuma_conttoni_kering', 'conttoniKering'),
                trainSingleModel(models.spinosumBasah, 'eucheuma_spinosum_basah', 'spinosumBasah'),
                trainSingleModel(models.spinosumKering, 'eucheuma_spinosum_kering', 'spinosumKering'),
            ]);

            // Kirim model dan parameter normalisasi ke parent
            onModelsTrained(models, {
                featureRanges,
                outputParams: {
                    conttoniBasah: conttoniBasahParams,
                    conttoniKering: conttoniKeringParams,
                    spinosumBasah: spinosumBasahParams,
                    spinosumKering: spinosumKeringParams,
                },
            });
            try {
                // Simpan semua model ke database
                await Promise.all([
                    saveModelToDB(
                        models.conttoniBasah,
                        'conttoni_basah',
                        {
                            featureRanges,
                            outputMin: conttoniBasahParams.outputMin,
                            outputMax: conttoniBasahParams.outputMax,
                        },
                        indikator,
                    ),
                    saveModelToDB(
                        models.conttoniKering,
                        'conttoni_kering',
                        {
                            featureRanges,
                            outputMin: conttoniKeringParams.outputMin,
                            outputMax: conttoniKeringParams.outputMax,
                        },
                        indikator,
                    ),
                    saveModelToDB(
                        models.spinosumKering,
                        'spinosum_basah',
                        {
                            featureRanges,
                            outputMin: spinosumBasahParams.outputMin,
                            outputMax: spinosumBasahParams.outputMax,
                        },
                        indikator,
                    ),
                    saveModelToDB(
                        models.spinosumBasah,
                        'spinosum_kering',
                        {
                            featureRanges,
                            outputMin: spinosumBasahParams.outputMin,
                            outputMax: spinosumBasahParams.outputMax,
                        },
                        indikator,
                    ),
                ]);

                console.log('All models saved to database');
            } catch (error) {
                console.error('Error saving models:', error);
            }
        } catch (error) {
            setErrorModel({
                text: 'Gagal Melakukan prediksi, ini mungkin kesalahan akibat train model yang salah. mohon ulangi sekali lagi',
                status: true,
            });
            setIsErrorModel(true);
        } finally {
            setTraining(false);
        }
    };

    return (
        <div className="rounded-lg border bg-gray-50 p-6">
            <Toast open={isErrorModel} onOpenChange={setIsErrorModel} title="Terjadi Kesalahan Prediksi" description={errorModel.text} />
            <h3 className="mb-4 text-lg font-semibold">Pelatihan 4 Model</h3>

            <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                    <span>Mulai Lakukan Pelatihan Untuk Semua Model</span>
                    <span>{progress.conttoniBasah.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${progress.conttoniBasah}%` }}></div>
                </div>
            </div>

            {/* Progress bars untuk 3 model lainnya... */}

            <Button onClick={trainAllModels} disabled={training} className="mt-4 w-full">
                {training ? 'Melatih Semua Model...' : 'Latih Semua Model'}
            </Button>
        </div>
    );
}
