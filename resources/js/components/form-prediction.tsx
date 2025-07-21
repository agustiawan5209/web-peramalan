// components/form-prediction.tsx
import { IndikatorTypes } from '@/types';
import * as tf from '@tensorflow/tfjs';
import { useState } from 'react';
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
}

export default function FormPrediction({ transactionX, transactionY, indikator }: FormPredictionProps) {
    const [models, setModels] = useState({
        conttoniBasah: null as tf.Sequential | null,
        conttoniKering: null as tf.Sequential | null,
        spinosumBasah: null as tf.Sequential | null,
        spinosumKering: null as tf.Sequential | null,
    });

    const [normalizationParams, setNormalizationParams] = useState<any>(null);

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

    return (
        <div className="space-y-6">
            <TrainModels indikator={indikator} transactionX={transactionX} transactionY={transactionY} onModelsTrained={handleModelsTrained} />

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
        </div>
    );
}
