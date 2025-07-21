import FormPanen from '@/components/form-panen';
import { Button } from '@/components/ui/button';
import { IndikatorTypes } from '@/types';
import * as tf from '@tensorflow/tfjs';
import React, { useEffect, useState } from 'react';
import PredictionChart from './prediction-chart';

interface ParameterTransaction {
    indikator_id: number;
    nilai: string | null;
}
interface MultipleLinearRegressionProps {
    transactionX: any[];
    transactionY: {
        eucheuma_conttoni_basah: number;
        eucheuma_conttoni_kering: number;
        eucheuma_spinosum_basah: number;
        eucheuma_spinosum_kering: number;
    }[];
    indikator: IndikatorTypes[];
}

const opsiKejernihan = [
    { value: 5, label: 'Sangat Jernih' },
    { value: 4, label: 'Jernih' },
    { value: 3, label: 'Agak Keruh' },
    { value: 2, label: 'Keruh' },
    { value: 1, label: 'Sangat Keruh' },
];
const opsiCahaya = [
    { value: 5, label: 'Sangat Cerah' },
    { value: 4, label: 'Cerah' },
    { value: 3, label: 'Berawan' },
    { value: 2, label: 'Mendung' },
    { value: 1, label: 'Gelap' },
];
const opsiArus = [
    { value: 5, label: 'Sangat Kuat' },
    { value: 4, label: 'Kuat' },
    { value: 3, label: 'Sedang' },
    { value: 2, label: 'Lemah' },
    { value: 1, label: 'Sangat Lemah' },
];
const opsiNutrisi = [
    { value: 4, label: 'Melimpah' },
    { value: 3, label: 'Cukup' },
    { value: 2, label: 'Terbatas' },
    { value: 1, label: 'Sangat Sedikit' },
];
export default function FormPrediction({ transactionX, transactionY, indikator }: MultipleLinearRegressionProps) {
    const [modelEucheuma, setModelEucheuma] = useState<tf.Sequential | null>(null);
    const [training, setTraining] = useState(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [predictionEucheuma, setPredictionEucheuma] = useState<number | null>(null);

    useEffect(() => {
        // Inisialisasi modelEucheuma saat komponen mount
        const initModel = () => {
            const modelEucheuma = tf.sequential();
            modelEucheuma.add(
                tf.layers.dense({
                    units: 1,
                    inputShape: [indikator.length], // 15 variabel input
                }),
            );
            return modelEucheuma;
        };

        setModelEucheuma(initModel());
        return () => {
            // Cleanup
            if (modelEucheuma) {
                modelEucheuma.dispose();
            }
        };
    }, []);

    const [data, setData] = useState<any[]>(transactionX || []);

    const [normalizationParams, setNormalizationParams] = useState<{
        featureRanges: { min: number; max: number }[];
        outputMin: number;
        outputMax: number;
    } | null>(null);

    // Hitung min-max untuk setiap fitur
    const featureRanges = indikator.map((_, i) => {
        const values = data.map((point: any) => {
            // Ambil nilai numerik langsung
            return point[i];
        });
        return {
            min: Math.min(...values),
            max: Math.max(...values),
        };
    });
    // Normalisasi data
    // Fungsi normalisasi input
    const normalize = (value: number, min: number, max: number) => {
        /**
         * Normalisasi nilai input agar berada dalam rentang 0-1.
         * Jika nilai input kurang dari min, maka nilainya akan diubah menjadi 0.
         * Jika nilai input lebih dari max, maka nilainya akan diubah menjadi 1.
         * @param value nilai input yang akan dinormalisasi
         * @param min nilai minimum
         * @param max nilai maximum
         * @returns nilai yang telah dinormalisasi
         */
        if (min === max) return 0;
        let normalizedValue = (value - min) / (max - min);
        if (normalizedValue < 0) normalizedValue = 0; // Pastikan tidak negatif
        if (normalizedValue > 1) normalizedValue = 1; // Pastikan tidak lebih dari 1
        return normalizedValue;
    };
    const InputXs = data.map((point: any, key) => {
        let InputX: any = [];
        indikator.map((item: any, index) => {
            InputX.push(normalize(point[index], featureRanges[index].min, featureRanges[index].max));
        });
        return InputX;
    });

    // Normalisasi output juga
    const outputValues = transactionY.map((point) => point.eucheuma_conttoni_basah);
    const outputMin = Math.min(...outputValues);
    const outputMax = Math.max(...outputValues);
    const Ydataeucheuma_conttoni = transactionY.map((point) => point.eucheuma_conttoni_basah);

    const ysEuchuma = tf.tensor2d(transactionY.map((point) => [normalize(point.eucheuma_conttoni_basah, outputMin, outputMax)]));

    const trainModel = async () => {
        if (!modelEucheuma) return;

        setTraining(true);

        // Persiapan data dengan normalisasi
        const xs = tf.tensor2d(InputXs);
        // Kompilasi modelEucheuma dengan learning rate yang lebih kecil
        modelEucheuma.compile({
            optimizer: tf.train.adam(0.001), // Menggunakan Adam optimizer dengan learning rate lebih kecil
            loss: 'meanSquaredError',
        });
        // Pelatihan dengan lebih banyak epoch
        await modelEucheuma.fit(xs, ysEuchuma, {
            epochs: 200,
            batchSize: 32,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch Eucheuma ${epoch}: loss = ${logs?.loss}`);
                },
            },
        });

        // Simpan parameter normalisasi untuk prediksi
        setNormalizationParams({
            featureRanges,
            outputMin,
            outputMax,
        });

        // Simpan model ke session storage
        // Tidak perlu karena model akan dihapus ketika browser di-close
        localStorage.setItem('modelEucheuma', JSON.stringify(modelEucheuma));

        // Dispose tensors
        xs.dispose();
        ysEuchuma.dispose();

        setTraining(false);
    };

    const [parameter, setParameter] = useState<ParameterTransaction[]>(
        indikator.map((_, index) => ({
            indikator_id: indikator[index].id,
            nilai: null,
        })),
    );

    const [mse, setMSE] = useState<number | null>(null);
    const [rSquared, setRSquared] = useState<number | null>(null);

    const predictData = (model: tf.Sequential, input: number[], min: number, max: number) => {
        const inputTensor = tf.tensor2d([input]);
        const prediction = model.predict(inputTensor) as tf.Tensor;
        let value = prediction.dataSync()[0];

        inputTensor.dispose();
        prediction.dispose();

        /**
         * Denormalisasi nilai output agar berada dalam rentang asli.
         * @param value nilai output yang akan dide-normalisasi
         * @param min nilai minimum
         * @param max nilai maximum
         * @returns nilai yang telah dide-normalisasi
         */
        return value * (max - min) + min;
    };
    const getNilaiParameter: any = (parameter: ParameterTransaction[], id: number) => {
        return parameter.filter((item) => item.indikator_id == id)[0].nilai;
    };
    /**
     * Fungsi untuk prediksi eucheuma conttoni
     */
    const predict = () => {
        if (!modelEucheuma || !parameter || !normalizationParams) {
            console.error('Model, parameter, or normalization params not ready');
            return;
        }

        try {
            // Normalisasi input
            const inputArr: number[] = [];
            indikator.map((item: any, index) => {
                inputArr.push(normalize(getNilaiParameter(parameter, item.id), featureRanges[index].min, featureRanges[index].max));
            });

            setPredictionEucheuma(predictData(modelEucheuma, inputArr, normalizationParams.outputMin, normalizationParams.outputMax));

            const Hasil_MSE = tf.losses.meanSquaredError(ysEuchuma, modelEucheuma.predict(tf.tensor2d(InputXs)) as tf.Tensor);
            const Hasil_RSquared = tf.metrics.r2Score(ysEuchuma, modelEucheuma.predict(tf.tensor2d(InputXs)) as tf.Tensor);

            setMSE(Hasil_MSE.dataSync()[0]);
            setRSquared(Hasil_RSquared.dataSync()[0]);
            // Fungsi denormalisasi output
        } catch (error) {
            console.error('Prediction error:', error);
            setPrediction(null);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const key = name.split('.')[1];
        if (key === undefined) {
            console.error('Key is undefined:', name);
            return;
        }

        const index = Number(key);
        if (isNaN(index)) {
            console.error('Key is not a number:', key);
            return;
        }

        const parameterCopy = [...parameter];
        const item = parameterCopy[index];
        if (!item) {
            console.error('Item is undefined at index:', index);
            return;
        }

        parameterCopy[index] = {
            ...item,
            nilai: value,
        };

        setParameter(parameterCopy);
    };
    const handleSelectChange = (name: string, value: string) => {
        setParameter((prevData) => ({
            ...prevData,
            parameter: parameter.map((item, index) => {
                if (index === Number(name)) {
                    return {
                        ...item,
                        nilai: value,
                    };
                } else {
                    return item;
                }
            }),
        }));
    };

    return (
        <>
            <section className="mb-10 rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 shadow-xl">
                <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">Input Parameter</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        predict();
                    }}
                >
                    <FormPanen parameter={parameter} indikator={indikator} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                    <div className="mt-8 flex gap-4 md:col-span-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={trainModel}
                            disabled={training}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
                        >
                            {training ? (
                                <span className="flex items-center gap-2">
                                    <span className="border-opacity-50 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                                    Training...
                                </span>
                            ) : (
                                'Train Model'
                            )}
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-white shadow transition hover:bg-gray-800"
                        >
                            Prediksi
                        </Button>
                    </div>
                </form>
                {predictionEucheuma !== null && (
                    <>
                        <ul className="mt-10 space-y-2 rounded-xl bg-green-100/60 p-6 font-medium text-green-900 shadow-inner">
                            <li>
                                <span className="font-semibold">Hasil Prediksi Eucheuma Conttoni:</span>
                                <span className="ml-2 text-lg">{predictionEucheuma.toFixed(2)} kg</span>
                            </li>
                        </ul>
                        <ul className="mx-auto mt-6 flex flex-col gap-2 rounded-xl bg-blue-50 p-6 shadow-inner">
                            <li className="font-medium text-blue-900">
                                Mean Squared Error (MSE): <span className="font-mono">{mse !== null ? mse.toFixed(4) : 'Belum dihitung'}</span>
                            </li>
                            <li className="font-medium text-blue-900">
                                R-Squared: <span className="font-mono">{rSquared !== null ? rSquared.toFixed(4) : 'Belum dihitung'}</span>
                            </li>
                        </ul>
                    </>
                )}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow">
                    {predictionEucheuma !== null && (
                        <PredictionChart
                            dataRumputlautX1={Ydataeucheuma_conttoni.slice(-10)}
                            predictionX1={predictionEucheuma}
                            mse={mse}
                            rSquared={rSquared}
                        />
                    )}
                </div>
            </section>
        </>
    );
}
