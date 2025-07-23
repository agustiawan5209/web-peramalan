import ModelCard from '@/components/dashboard/ModelCard';
import PredictionCharts from '@/components/prediction-chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { loadPredictionFromDB } from '@/utils/predictionstorage';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Database, Leaf, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
// Import the default export from each file
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardViewProps {
    baseJenisRumputLaut: string[];
    totalDataPanen: number;
    indikator: number;
    transactionY: {
        eucheuma_conttoni_basah: number;
        eucheuma_conttoni_kering: number;
        eucheuma_spinosum_basah: number;
        eucheuma_spinosum_kering: number;
    }[];
}

export default function Dashboard({ baseJenisRumputLaut, totalDataPanen, indikator, transactionY }: DashboardViewProps) {
    const stats = [
        { title: 'Total Data Panen', value: totalDataPanen, icon: <Database size={24} /> },
        { title: 'Model Tersedia', value: '4', icon: <Leaf size={24} /> },
        { title: 'Total Indikator', value: indikator, icon: <TrendingUp size={24} />, change: '+2%' },
    ];

    const [prediction, setPrediction] = useState<{
        conttoniBasah: { prediction: number; mse: number; rsquared: number };
        conttoniKering: { prediction: number; mse: number; rsquared: number };
        spinosumBasah: { prediction: number; mse: number; rsquared: number };
        spinosumKering: { prediction: number; mse: number; rsquared: number };
    }>({
        conttoniBasah: { prediction: 0, mse: 0, rsquared: 0 },
        conttoniKering: { prediction: 0, mse: 0, rsquared: 0 },
        spinosumBasah: { prediction: 0, mse: 0, rsquared: 0 },
        spinosumKering: { prediction: 0, mse: 0, rsquared: 0 },
    });
    const [actualData, setActualData] = useState<{
        conttoniBasah: number[];
        conttoniKering: number[];
        spinosumBasah: number[];
        spinosumKering: number[];
    }>({
        conttoniBasah: [],
        conttoniKering: [],
        spinosumBasah: [],
        spinosumKering: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleLoadingModel = async () => {
        setIsLoading(true);
        try {
            baseJenisRumputLaut.map(async (jenisRumputLaut) => {
                const { prediction, mse, rsquared } = await loadPredictionFromDB(jenisRumputLaut);
                setPrediction((prev: any) => ({
                    ...prev,
                    [jenisRumputLaut]: { prediction, mse, rsquared },
                }));
            });
            setActualData({
                conttoniBasah: transactionY.map((p) => p.eucheuma_conttoni_basah),
                conttoniKering: transactionY.map((p) => p.eucheuma_conttoni_kering),
                spinosumBasah: transactionY.map((p) => p.eucheuma_spinosum_basah),
                spinosumKering: transactionY.map((p) => p.eucheuma_spinosum_kering),
            });
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };
    useEffect(() => {
        handleLoadingModel();
    }, [baseJenisRumputLaut, transactionY]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Prediksi Panen Rumput Laut</h1>

                {/* Statistik */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.title}</p>
                                    <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                                    <p className="mt-1 text-xs text-green-500">{stat.change}</p>
                                </div>
                                <div className="rounded-full bg-green-50 p-2 text-green-500">{stat.icon}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Grafik dan Model */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {actualData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2"
                        >
                            <h2 className="mb-4 text-lg font-semibold">Prediksi Panen 6 Bulan Mendatang</h2>
                            <PredictionCharts
                                predictionX1={prediction.conttoniBasah.prediction}
                                predictionX2={prediction.conttoniKering.prediction}
                                predictionX3={prediction.spinosumBasah.prediction}
                                predictionX4={prediction.spinosumKering.prediction}
                                dataRumputlautX1={actualData.conttoniBasah.slice(-10)}
                                dataRumputlautX2={actualData.conttoniKering.slice(-10)}
                                dataRumputlautX3={actualData.spinosumBasah.slice(-10)}
                                dataRumputlautX4={actualData.spinosumKering.slice(-10)}
                            />
                        </motion.div>
                    )}

                    {prediction && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-4">
                            {prediction &&
                                Object.keys(prediction).map((jenisRumputLaut) => {
                                    const jenisRumputLautKey = jenisRumputLaut as keyof typeof prediction;
                                    return (
                                        <ModelCard
                                            key={jenisRumputLaut}
                                            title={jenisRumputLaut}
                                            prediction={prediction[jenisRumputLautKey].prediction}
                                            mse={prediction[jenisRumputLautKey].mse}
                                            rsquared={prediction[jenisRumputLautKey].rsquared}
                                        />
                                    );
                                })}
                        </motion.div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
