// components/predict-models.tsx
import FormPanen from '@/components/form-panen';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IndikatorTypes, ParameterTransaction } from '@/types';
import { savePredictionToDB } from '@/utils/predictionstorage';
import * as tf from '@tensorflow/tfjs';
import { useState } from 'react';
import PredictionCharts from './prediction-chart';
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
    const predictAll = () => {
        if (!normalizationParams && models && actualData) return;

        const newPredictions = { ...predictions };
        const newMetrics = { ...metrics };

        // Prediksi untuk setiap jenis
        Object.keys(models).forEach((key: any) => {
            const model = models[key as keyof typeof models];
            if (!model) return;

            // Initialize the inputArr object outside forEach
            const inputArr: Record<string, number[]> = {};

            // Initialize empty array for each model key
            inputArr[key] = [];

            indikator.forEach((indikatorItem, i) => {
                const param = parameter.find((p) => p.indikator_id === indikatorItem.id);
                if (param) {
                    const normalizedValue = normalize(
                        Number(param.nilai),
                        normalizationParams.featureRanges[i].min,
                        normalizationParams.featureRanges[i].max,
                    );
                    inputArr[key].push(normalizedValue);
                }
            });

            const prediction = makePrediction(
                model,
                inputArr[key],
                normalizationParams.outputParams[key].outputMin,
                normalizationParams.outputParams[key].outputMax,
            );
            console.log(prediction);

            newPredictions[key as keyof typeof newPredictions] = prediction;

            // Hitung metrik
            const xs = tf.tensor2d(
                actualData[key as keyof typeof actualData].map((_, i) => {
                    console.log(key);
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

        setPredictions(newPredictions);
        setMetrics(newMetrics);
    };

    return (
        <div className={'rounded-lg border bg-white p-6 shadow'}>
            <h3 className="mb-4 text-lg font-semibold">Prediksi 4 Jenis Rumput Laut</h3>
            <div className={cn('grid grid-cols-1 gap-4', className)}>
                <div className='col-span-1'>
                    <FormPanen parameter={parameter} indikator={indikator} handleChange={handleChange} />

                    <Button onClick={predictAll} className="mt-4 w-full">
                        Prediksi Semua
                    </Button>
                </div>
                <div className='col-span-1'>
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
