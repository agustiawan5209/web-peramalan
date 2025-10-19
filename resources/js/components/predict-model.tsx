// components/predict-models.tsx
import FormPanen from '@/components/form-panen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IndikatorTypes, ParameterTransaction, SharedData } from '@/types';
import { savePredictionToDB } from '@/utils/predictionstorage';
import { usePage } from '@inertiajs/react';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import { AlertCircle, Calendar, Lightbulb, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
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

interface PredictionHistory {
    id: number;
    predictions: typeof predictions;
    timestamp: Date;
    parameters: any[];
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

    const [previousPredictions, setPreviousPredictions] = useState<typeof predictions | null>(null);
    const [predictionHistory, setPredictionHistory] = useState<PredictionHistory[]>([]);
    const [metrics, setMetrics] = useState({
        conttoniBasah: { mse: null as number | null, r2: null as number | null },
        conttoniKering: { mse: null as number | null, r2: null as number | null },
        spinosumBasah: { mse: null as number | null, r2: null as number | null },
        spinosumKering: { mse: null as number | null, r2: null as number | null },
    });

    // Load prediction history from localStorage on component mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('predictionHistory');
        if (savedHistory) {
            try {
                const history = JSON.parse(savedHistory);
                setPredictionHistory(
                    history.map((item: any) => ({
                        ...item,
                        timestamp: new Date(item.timestamp),
                    })),
                );
            } catch (error) {
                console.error('Error loading prediction history:', error);
            }
        }
    }, []);

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
     * Calculate comparison metrics between current and previous predictions
     */
    const calculateComparison = (current: number | null, previous: number | null) => {
        if (!current || !previous) return null;

        const difference = current - previous;
        const percentage = previous !== 0 ? (difference / previous) * 100 : 0;

        return {
            difference,
            percentage,
            trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
        };
    };

    /**
     * Generate insights based on prediction results and comparisons
     */
    const generateInsights = (predictionData: typeof predictions, previousData: typeof predictions | null) => {
        const insights: string[] = [];

        // Overall production insight
        const totalProduction = Object.values(predictionData).reduce((sum, val) => sum + (val || 0), 0);
        if (totalProduction > 10000) {
            insights.push('Produksi diperkirakan sangat tinggi - pertimbangkan kapasitas penyimpanan dan distribusi');
        } else if (totalProduction < 2000) {
            insights.push('Produksi relatif rendah - evaluasi kondisi lingkungan dan perawatan');
        }

        // Comparison insights
        if (previousData) {
            const cottoniBasahComp = calculateComparison(predictionData.conttoniBasah, previousData.conttoniBasah);
            if (cottoniBasahComp && Math.abs(cottoniBasahComp.percentage) > 10) {
                insights.push(
                    `Cottoni Basah ${cottoniBasahComp.trend === 'up' ? 'meningkat' : 'menurun'} signifikan (${Math.abs(cottoniBasahComp.percentage).toFixed(1)}%)`,
                );
            }
        }

        // Quality insights based on metrics
        Object.entries(metrics).forEach(([key, metric]) => {
            if (metric.r2 && metric.r2 < 0.7) {
                insights.push(`Model ${key} memiliki akurasi rendah - pertimbangkan data training tambahan`);
            }
        });

        return insights.length > 0 ? insights : ['Prediksi menunjukkan kondisi produksi normal. Pertahankan praktik budidaya saat ini.'];
    };

    /**
     * Save prediction to history
     */
    const saveToHistory = (newPredictions: typeof predictions, parameters: any[]) => {
        const newHistory: PredictionHistory = {
            id: Date.now(),
            predictions: newPredictions,
            timestamp: new Date(),
            parameters: parameters,
        };

        const updatedHistory = [newHistory, ...predictionHistory.slice(0, 4)]; // Keep last 5 predictions
        setPredictionHistory(updatedHistory);
        localStorage.setItem('predictionHistory', JSON.stringify(updatedHistory));
    };

    const getriwayatPrediksi = async () => {
        try {
            const response = await axios.get(route('api.get.riwayat.pengguna', { userId: auth.user.id }));
            const modeldata: {
                conttoniBasah: number | null;
                conttoniKering: number | null;
                spinosumBasah: number | null;
                spinosumKering: number | null;
            } = response.data;
            setPreviousPredictions(modeldata);
        } catch (error) {
            console.log(error);
        }
    };
    const predictAll = (e: React.FormEvent) => {
        e.preventDefault();

        if (!normalizationParams || !models || !actualData || !transactionX) {
            setErrorModel({ text: 'Data tidak lengkap', status: true });
            return;
        }

        try {
            // Save current predictions as previous before making new ones

            getriwayatPrediksi();

            const newPredictions = { ...predictions };
            const newMetrics = { ...metrics };

            // Prepare input
            const inputArr = indikator.map((_, i) => {
                const param = parameter.find((p) => p.indikator_id === indikator[i].id);
                const nilai = param?.nilai ?? 0;
                const range = normalizationParams.featureRanges[i] || { min: 0, max: 1 };
                return normalize(Number(nilai), range.min, range.max);
            });

            const modelKeys = Object.keys(models) as Array<keyof typeof models>;

            modelKeys.forEach((key) => {
                const model = models[key];
                if (!model) return;

                try {
                    // Prediction
                    const outputParams = normalizationParams.outputParams[key];
                    if (!outputParams) return;

                    const prediction = makePrediction(model, inputArr, outputParams.outputMin, outputParams.outputMax);
                    newPredictions[key] = Math.abs(prediction);

                    // Metrics calculation
                    tf.tidy(() => {
                        const xs = tf.tensor2d(
                            actualData[key].map((_, i) => {
                                return indikator.map((_, j) => {
                                    const range = normalizationParams.featureRanges[j] || { min: 0, max: 1 };
                                    return normalize(transactionX[i][j], range.min, range.max);
                                });
                            }),
                        );

                        const ys = tf.tensor2d(actualData[key].map((val) => [normalize(val, outputParams.outputMin, outputParams.outputMax)]));

                        const preds = model.predict(xs) as tf.Tensor;

                        newMetrics[key] = {
                            mse: tf.metrics.meanSquaredError(ys, preds).dataSync()[0],
                            r2: Math.abs(tf.metrics.r2Score(ys, preds).dataSync()[0]),
                        };
                    });

                    savePredictionToDB(prediction, key, newMetrics[key].mse, newMetrics[key].r2);
                } catch (error) {
                    console.error(`Error processing model ${key}:`, error);
                }
            });

            // Save to history
            saveToHistory(newPredictions, parameter);

            if (auth.user) {
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
            setIsErrorModel(true);
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

    const insights = generateInsights(predictions, previousPredictions);

    return (
        <div className={'rounded-lg border bg-white p-6 shadow'}>
            <Toast open={isErrorModel} onOpenChange={setIsErrorModel} title="Terjadi Kesalahan Prediksi" description={errorModel.text} />

            <h3 className="mb-4 text-lg font-semibold">Prediksi 4 Jenis Rumput Laut</h3>

            <div className={cn('grid grid-cols-1 gap-6', className)}>
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
                        <div className="mt-6 space-y-6">
                            {/* Insights Card */}
                            <Card className="border-blue-200 bg-blue-50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg text-blue-900">
                                        <Lightbulb className="h-5 w-5" />
                                        Insights & Rekomendasi Sistem
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {insights.map((insight, index) => (
                                            <div key={index} className="flex items-start gap-3 text-sm">
                                                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                                                <span className="text-blue-800">{insight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comparison Overview */}
                            {previousPredictions && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <TrendingUp className="h-5 w-5" />
                                            Perbandingan dengan Prediksi Sebelumnya
                                        </CardTitle>
                                        <CardDescription>Perubahan hasil prediksi terkini dibandingkan prediksi sebelumnya</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {Object.keys(predictions).map((key) => {
                                                const current = predictions[key as keyof typeof predictions];
                                                const previous = previousPredictions[key as keyof typeof predictions];
                                                const comparison = calculateComparison(current, previous);

                                                if (!comparison) return null;

                                                return (
                                                    <div key={key} className="rounded-lg border p-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                                            <Badge
                                                                variant={
                                                                    comparison.trend === 'up'
                                                                        ? 'default'
                                                                        : comparison.trend === 'down'
                                                                          ? 'destructive'
                                                                          : 'secondary'
                                                                }
                                                                className="flex items-center gap-1"
                                                            >
                                                                {comparison.trend === 'up' ? (
                                                                    <TrendingUp className="h-3 w-3" />
                                                                ) : comparison.trend === 'down' ? (
                                                                    <TrendingDown className="h-3 w-3" />
                                                                ) : (
                                                                    <Minus className="h-3 w-3" />
                                                                )}
                                                                {Math.abs(comparison.percentage).toFixed(1)}%
                                                            </Badge>
                                                        </div>
                                                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <div className="text-gray-600">Sebelumnya</div>
                                                                <div className="font-semibold">
                                                                    {previous?.toLocaleString('id-ID', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })}{' '}
                                                                    kg
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-gray-600">Sekarang</div>
                                                                <div className="font-semibold">
                                                                    {current?.toLocaleString('id-ID', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })}{' '}
                                                                    kg
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Current Predictions */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {predictions.conttoniBasah !== null && (
                                    <EnhancedPredictionCard
                                        title="Eucheuma Cottoni Basah"
                                        value={predictions.conttoniBasah}
                                        unit="kg"
                                        mse={metrics.conttoniBasah.mse}
                                        r2={metrics.conttoniBasah.r2}
                                        previousValue={previousPredictions?.conttoniBasah}
                                    />
                                )}
                                {predictions.conttoniKering !== null && (
                                    <EnhancedPredictionCard
                                        title="Eucheuma Cottoni Kering"
                                        value={predictions.conttoniKering}
                                        unit="kg"
                                        mse={metrics.conttoniKering.mse}
                                        r2={metrics.conttoniKering.r2}
                                        previousValue={previousPredictions?.conttoniKering}
                                    />
                                )}
                                {predictions.spinosumBasah !== null && (
                                    <EnhancedPredictionCard
                                        title="Eucheuma Spinosum Basah"
                                        value={predictions.spinosumBasah}
                                        unit="kg"
                                        mse={metrics.spinosumBasah.mse}
                                        r2={metrics.spinosumBasah.r2}
                                        previousValue={previousPredictions?.spinosumBasah}
                                    />
                                )}
                                {predictions.spinosumKering !== null && (
                                    <EnhancedPredictionCard
                                        title="Eucheuma Spinosum Kering"
                                        value={predictions.spinosumKering}
                                        unit="kg"
                                        mse={metrics.spinosumKering.mse}
                                        r2={metrics.spinosumKering.r2}
                                        previousValue={previousPredictions?.spinosumKering}
                                    />
                                )}
                            </div>

                            {/* Prediction History */}
                            {predictionHistory.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Calendar className="h-5 w-5" />
                                            Riwayat Prediksi
                                        </CardTitle>
                                        <CardDescription>5 prediksi terakhir yang dilakukan</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {predictionHistory.slice(0, 3).map((history) => (
                                                <div key={history.id} className="rounded-lg border p-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">{history.timestamp.toLocaleString('id-ID')}</span>
                                                        <span className="font-medium">
                                                            Total:{' '}
                                                            {Object.values(history.predictions)
                                                                .reduce((sum, val) => sum + (val || 0), 0)
                                                                .toLocaleString('id-ID')}{' '}
                                                            kg
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

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

const EnhancedPredictionCard = ({
    title,
    value,
    unit,
    mse,
    r2,
    previousValue,
}: {
    title: string;
    value: number | null;
    unit: string;
    mse: number | null;
    r2: number | null;
    previousValue?: number | null;
}) => {
    const comparison = calculateComparison(value, previousValue);

    return (
        <Card className="border-green-200">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-green-800">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-3">
                    <p className="text-2xl font-bold">
                        {Number(value).toLocaleString('id-ID', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}{' '}
                        {unit}
                    </p>

                    {comparison && previousValue && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="text-gray-600">vs sebelumnya:</span>
                            <Badge
                                variant={comparison.trend === 'up' ? 'default' : comparison.trend === 'down' ? 'destructive' : 'secondary'}
                                className="flex items-center gap-1"
                            >
                                {comparison.trend === 'up' ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : comparison.trend === 'down' ? (
                                    <TrendingDown className="h-3 w-3" />
                                ) : (
                                    <Minus className="h-3 w-3" />
                                )}
                                {Math.abs(comparison.difference).toLocaleString('id-ID')} kg ({comparison.trend === 'up' ? '+' : ''}
                                {comparison.percentage.toFixed(1)}%)
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <span className="text-gray-600">MSE:</span>
                        <span className="ml-2 font-mono">{mse?.toFixed(4)}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Akurasi (R²):</span>
                        <span className="ml-2 font-mono">{r2?.toFixed(4)}</span>
                    </div>
                </div>

                {r2 !== null && (
                    <div className="mt-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tingkat Kepercayaan:</span>
                            <span className={`font-medium ${r2 > 0.8 ? 'text-green-600' : r2 > 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {r2 > 0.8 ? 'Tinggi' : r2 > 0.6 ? 'Sedang' : 'Rendah'}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Helper function for comparison calculation
function calculateComparison(current: number | null, previous: number | null) {
    if (!current || !previous) return null;

    const difference = current - previous;
    const percentage = previous !== 0 ? (difference / previous) * 100 : 0;

    return {
        difference,
        percentage,
        trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
    };
}
