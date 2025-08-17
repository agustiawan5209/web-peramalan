// components/predict-models.tsx
import FormPanen from '@/components/form-panen';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IndikatorTypes, ParameterTransaction, SharedData } from '@/types';
import { savePredictionToDB } from '@/utils/predictionstorage';
import { usePage } from '@inertiajs/react';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import { useState } from 'react';
import PredictionCharts from './prediction-chart';
import { Toast } from './ui/toast';
interface PredictModelsProps {
    models: {
        conttoniBasah: tf.Sequential | null;
        conttoniKering: tf.Sequential | null;
        spinosumBasah: tf.Sequential | null;
        spinosumKering: tf.Sequential | null;
    };
    normalizationParams: any;
    transactionX: any;
    indikator: IndikatorTypes[];
    actualData: {
        conttoniBasah: number[];
        conttoniKering: number[];
        spinosumBasah: number[];
        spinosumKering: number[];
    };
    className?: string;
}
export default function PredictModels({ models, normalizationParams, transactionX, indikator, actualData, className }: PredictModelsProps) {
    const { auth } = usePage<SharedData>().props;
    const [errorModel, setErrorModel] = useState<{ text: string; status: boolean }>({ text: '', status: false });
    const [isErrorModel, setIsErrorModel] = useState<boolean>(false);

    const [parameter, setParameter] = useState<ParameterTransaction[]>(
        indikator.map((_, index) => ({
            indikator_id: indikator[index].id,
            nilai: null,
        })),
    );

    const [predictions, setPredictions] = useState({
        conttoniBasah: null as number | null,
        conttoniKering: null as number | null,
        spinosumBasah: null as number | null,
        spinosumKering: null as number | null,
    });

    const [metrics, setMetrics] = useState({
        conttoniBasah: { mse: null as number | null, r2: null as number | null },
        conttoniKering: { mse: null as number | null, r2: null as number | null },
        spinosumBasah: { mse: null as number | null, r2: null as number | null },
        spinosumKering: { mse: null as number | null, r2: null as number | null },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const key = name.split('.')[1];
        const index = Number(key);

        setParameter((prev) => {
            const newParams = [...prev];
            newParams[index] = { ...newParams[index], nilai: value };
            return newParams;
        });
    };
    // Utility functions for prediction
    const normalize = (value: number, min: number, max: number): number => {
        if (min === max) return 0;
        return Math.min(1, Math.max(0, (value - min) / (max - min)));
    };

    const makePrediction = (model: tf.Sequential, normalizedInput: number[], outputMin: number, outputMax: number): number => {
        const inputTensor = tf.tensor2d([normalizedInput]);
        const predictionTensor = model.predict(inputTensor) as tf.Tensor;
        const predictionValue = predictionTensor.dataSync()[0];

        // Denormalize the output
        const denormalizedValue = predictionValue * (outputMax - outputMin) + outputMin;

        // Cleanup tensors
        inputTensor.dispose();
        predictionTensor.dispose();

        return denormalizedValue;
    };
    /**
     * Prediksi untuk setiap jenis rumput laut.
     *
     * @description
     * Fungsi ini akan memprediksi nilai dari setiap jenis rumput laut
     * berdasarkan input yang diberikan oleh pengguna. Fungsi ini juga
     * akan menghitung metrik evaluasi model untuk setiap jenis rumput laut.
     *
     * @returns void
     */
    const predictAll = (e: React.FormEvent) => {
        e.preventDefault();
        if (!normalizationParams && models && actualData) return;

        const newPredictions = { ...predictions };
        const newMetrics = { ...metrics };

        // Initialize empty array for each model key
        const inputArr = indikator.map((_, i) => {
            const param = parameter.find((p) => p.indikator_id === indikator[i].id);
            return normalize(Number(param?.nilai), normalizationParams.featureRanges[i].min, normalizationParams.featureRanges[i].max);
        });

        try {
            // Prediksi untuk setiap jenis
            Object.keys(models).forEach((key: any) => {
                const model = models[key as keyof typeof models];
                if (!model) return;

                // Initialize the inputArr object outside forEach

                const prediction = makePrediction(
                    model,
                    inputArr,
                    normalizationParams.outputParams[key].outputMin,
                    normalizationParams.outputParams[key].outputMax,
                );
                newPredictions[key as keyof typeof newPredictions] = prediction;

                // Hitung metrik
                const xs = tf.tensor2d(
                    actualData[key as keyof typeof actualData].map((_, i) => {
                        return indikator.map((_, j) =>
                            normalize(transactionX[i][j], normalizationParams.featureRanges[j].min, normalizationParams.featureRanges[j].max),
                        );
                    }),
                );

                const ys = tf.tensor2d(
                    actualData[key as keyof typeof actualData].map((val) => [
                        normalize(val, normalizationParams.outputParams[key].outputMin, normalizationParams.outputParams[key].outputMax),
                    ]),
                );

                const preds = model.predict(xs) as tf.Tensor;
                newMetrics[key as keyof typeof newMetrics] = {
                    mse: tf.losses.meanSquaredError(ys, preds).dataSync()[0],
                    r2: tf.metrics.r2Score(ys, preds).dataSync()[0],
                };
                savePredictionToDB(prediction, key, newMetrics[key as keyof typeof newMetrics].mse, newMetrics[key as keyof typeof newMetrics].r2);
                // Cleanup
                xs.dispose();
                ys.dispose();
                preds.dispose();
            });

            if (auth.user && auth.role === 'user') {
                saveRiwayatUser(
                    indikator.map((_, i) => {
                        const param = parameter.find((p) => p.indikator_id === indikator[i].id);
                        return {
                            indikator: _.nama,
                            nilai: param?.nilai,
                        };
                    }),
                    newPredictions,
                );
            }
            setPredictions(newPredictions);
            setMetrics(newMetrics);
        } catch (error) {
            setErrorModel({
                text: 'Gagal Melakukan prediksi, ini mungkin kesalahan akibat train model yang salah. mohon ulangi sekali lagi',
                status: true,
            });
            setIsErrorModel(true)
        }
    };

    const saveRiwayatUser = async (parameter: any, prediction: any) => {
        try {
            const response = await axios.post(route('riwayatPengguna.store'), {
                user_id: auth.user.id,
                user: auth.user,
                model: prediction,
                parameter: parameter,
            });
        } catch (err) {
            console.log('gagal menyimpan riwayat', err);
        }
    };
    return (
        <div className={'rounded-lg border bg-white p-6 shadow'}>
            <Toast
            open={isErrorModel}
            onOpenChange={setIsErrorModel}
            title='Terjadi Kesalahan Prediksi'
            description={errorModel.text}
            />
            <h3 className="mb-4 text-lg font-semibold">Prediksi 4 Jenis Rumput Laut</h3>
            <div className={cn('grid grid-cols-1 gap-4', className)}>
                <form onSubmit={predictAll} className="col-span-1">
                    <FormPanen parameter={parameter} indikator={indikator} handleChange={handleChange} />

                    <Button type="submit" variant={'default'} className="mt-4 w-full">
                        Prediksi Semua
                    </Button>
                </form>
                <div className="col-span-1">
                    {(predictions.conttoniBasah !== null ||
                        predictions.conttoniKering !== null ||
                        predictions.spinosumBasah !== null ||
                        predictions.spinosumKering !== null) && (
                        <div className="mt-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {predictions.conttoniBasah && (
                                    <PredictionCard
                                        title="Eucheuma Cottoni Basah"
                                        value={predictions.conttoniBasah}
                                        unit="kg"
                                        mse={metrics.conttoniBasah.mse}
                                        r2={metrics.conttoniBasah.r2}
                                    />
                                )}
                                {predictions.conttoniKering && (
                                    <PredictionCard
                                        title="Eucheuma Cottoni Kering"
                                        value={predictions.conttoniKering}
                                        unit="kg"
                                        mse={metrics.conttoniKering.mse}
                                        r2={metrics.conttoniKering.r2}
                                    />
                                )}
                                {predictions.spinosumBasah && (
                                    <PredictionCard
                                        title="Eucheuma spinosum Basah"
                                        value={predictions.spinosumBasah}
                                        unit="kg"
                                        mse={metrics.spinosumBasah.mse}
                                        r2={metrics.spinosumBasah.r2}
                                    />
                                )}
                                {predictions.spinosumKering && (
                                    <PredictionCard
                                        title="Eucheuma spinosum Kering"
                                        value={predictions.spinosumKering}
                                        unit="kg"
                                        mse={metrics.spinosumKering.mse}
                                        r2={metrics.spinosumKering.r2}
                                    />
                                )}

                                {/* 3 card lainnya untuk jenis yang lain */}
                            </div>
                            <PredictionCharts
                                predictionX1={predictions.conttoniBasah}
                                predictionX2={predictions.conttoniKering}
                                predictionX3={predictions.spinosumBasah}
                                predictionX4={predictions.spinosumKering}
                                dataRumputlautX1={actualData.conttoniBasah.slice(-10)}
                                dataRumputlautX2={actualData.conttoniKering.slice(-10)}
                                dataRumputlautX3={actualData.spinosumBasah.slice(-10)}
                                dataRumputlautX4={actualData.spinosumKering.slice(-10)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const PredictionCard = ({
    title,
    value,
    unit,
    mse,
    r2,
}: {
    title: string;
    value: number | null;
    unit: string;
    mse: number | null;
    r2: number | null;
}) => (
    <div className="rounded-lg bg-green-50 p-4">
        <h4 className="font-medium text-green-800">{title}</h4>
        <p className="mt-2 text-2xl font-bold">
            {value?.toFixed(2)} {unit}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
                <span className="text-gray-600">MSE:</span>
                <span className="ml-2 font-mono">{mse?.toFixed(4)}</span>
            </div>
            <div>
                <span className="text-gray-600">R²:</span>
                <span className="ml-2 font-mono">{r2?.toFixed(4)}</span>
            </div>
        </div>
    </div>
);
