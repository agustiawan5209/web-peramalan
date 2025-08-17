// components/form-prediction.tsx
import { IndikatorTypes } from '@/types';
import { loadModelFromDB } from '@/utils/modelstorage';
import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
import PredictModels from './predict-model';
import TrainModels from './train-model';

interface FormPredictionProps {
    transactionX: any[];
    transactionY: {
        eucheuma_conttoni_basah: number;
        eucheuma_conttoni_kering: number;
        eucheuma_spinosum_basah: number;
        eucheuma_spinosum_kering: number;
    }[];
    indikator: IndikatorTypes[];
    showTrain: boolean
}

export default function FormPrediction({ transactionX, transactionY, indikator, showTrain = false }: FormPredictionProps) {
    const [models, setModels] = useState({
        conttoniBasah: null as tf.Sequential | null,
        conttoniKering: null as tf.Sequential | null,
        spinosumBasah: null as tf.Sequential | null,
        spinosumKering: null as tf.Sequential | null,
    });

    const [normalizationParams, setNormalizationParams] = useState<any>(null);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [indikatorData, setIndikatorData] = useState<IndikatorTypes[]>(indikator);
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
                    { indikator: indikator0, model: conttoniBasahModel, normalizationParams: conttoniBasahNormalizationParams },
                    { indikator: indikator1, model: conttoniKeringModel, normalizationParams: conttoniKeringNormalizationParams },
                    { indikator: indikator2, model: spinosumBasahModel, normalizationParams: spinosumBasahNormalizationParams },
                    { indikator: indikator4, model: spinosumKeringModel, normalizationParams: spinosumKeringNormalizationParams },
                    // ... lainnya
                ] = await Promise.all([
                    loadModelFromDB('conttoni_basah'),
                    loadModelFromDB('conttoni_kering'),
                    loadModelFromDB('spinosum_basah'),
                    loadModelFromDB('spinosum_kering'),
                    // ... lainnya
                ]);
                // console.log(indikator0)
                setIndikatorData(indikator0);

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

    return (
        <div className="space-y-6">
           {showTrain && <TrainModels indikator={indikator} transactionX={transactionX} transactionY={transactionY} onModelsTrained={handleModelsTrained} />
}
            {models && (
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
                />
            )}
        </div>
    );
}
