// components/form-prediction.tsx
import PredictModels from '@/components/predict-model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/main-layout';
import { IndikatorTypes } from '@/types';
import { loadModelFromDB } from '@/utils/modelstorage';
import { Head } from '@inertiajs/react';
import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
interface FormPredictionProps {
    transactionX: any[];
    transactionY: {
        eucheuma_conttoni_basah: number;
        eucheuma_conttoni_kering: number;
        eucheuma_spinosum_basah: number;
        eucheuma_spinosum_kering: number;
    }[];
    indikator: IndikatorTypes[];
}

export default function FormPrediction({ transactionX, transactionY, indikator }: FormPredictionProps) {
    const [models, setModels] = useState({
        conttoniBasah: null as tf.Sequential | null,
        conttoniKering: null as tf.Sequential | null,
        spinosumBasah: null as tf.Sequential | null,
        spinosumKering: null as tf.Sequential | null,
    });

    const [normalizationParams, setNormalizationParams] = useState<any>(null);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const handleModelsTrained = (
        trainedModels: {
            conttoniBasah: tf.Sequential;
            conttoniKering: tf.Sequential;
            spinosumBasah: tf.Sequential;
            spinosumKering: tf.Sequential;
        },
        params: any,
    ) => {
        setModels(trainedModels);
        setNormalizationParams(params);
    };

    // Memuat model saat komponen mount
    useEffect(() => {
        const loadModels = async () => {
            setIsLoadingModels(true);
            try {
                const [
                    { model: conttoniBasahModel, normalizationParams: conttoniBasahNormalizationParams },
                    { model: conttoniKeringModel, normalizationParams: conttoniKeringNormalizationParams },
                    { model: spinosumBasahModel, normalizationParams: spinosumBasahNormalizationParams },
                    { model: spinosumKeringModel, normalizationParams: spinosumKeringNormalizationParams },
                    // ... lainnya
                ] = await Promise.all([
                    loadModelFromDB('conttoni_basah'),
                    loadModelFromDB('conttoni_kering'),
                    loadModelFromDB('spinosum_basah'),
                    loadModelFromDB('spinosum_kering'),
                    // ... lainnya
                ]);

                setModels({
                    conttoniBasah: conttoniBasahModel,
                    conttoniKering: conttoniKeringModel,
                    spinosumBasah: spinosumBasahModel,
                    spinosumKering: spinosumKeringModel,
                });

                setNormalizationParams({
                    featureRanges: conttoniBasahNormalizationParams.featureRanges,
                    outputParams: {
                        conttoniBasah: {
                            outputMin: conttoniBasahNormalizationParams.outputMin,
                            outputMax: conttoniBasahNormalizationParams.outputMax,
                        },
                        conttoniKering: {
                            outputMin: conttoniKeringNormalizationParams.outputMin,
                            outputMax: conttoniKeringNormalizationParams.outputMax,
                        },
                        spinosumBasah: {
                            outputMin: spinosumBasahNormalizationParams.outputMin,
                            outputMax: spinosumBasahNormalizationParams.outputMax,
                        },
                        spinosumKering: {
                            outputMin: spinosumBasahNormalizationParams.outputMin,
                            outputMax: spinosumBasahNormalizationParams.outputMax,
                        },
                    },
                });
            } finally {
                setIsLoadingModels(false);
            }
        };

        loadModels();
    }, []);

    console.log(normalizationParams);
    return (
        <MainLayout>
            <Head title="Prediksi" />
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle>Prediksi</CardTitle>
                    </CardHeader>

                    <CardDescription>
                        <div className="mt-10">
                            <PredictModels
                                models={models}
                                normalizationParams={normalizationParams}
                                indikator={indikator}
                                transactionX={transactionX}
                                actualData={{
                                    conttoniBasah: transactionY.map((p) => p.eucheuma_conttoni_basah),
                                    conttoniKering: transactionY.map((p) => p.eucheuma_conttoni_kering),
                                    spinosumBasah: transactionY.map((p) => p.eucheuma_spinosum_basah),
                                    spinosumKering: transactionY.map((p) => p.eucheuma_spinosum_kering),
                                }}
                                className='md:grid-cols-2'
                            />
                        </div>
                    </CardDescription>
                </CardContent>
            </Card>
        </MainLayout>
    );
}
