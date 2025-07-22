import ModelCard from '@/components/dashboard/ModelCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import UserAuthLayout from '@/layouts/guest/user-auth-layout';
import { loadPredictionFromDB } from '@/utils/predictionstorage';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Database, Eye, Leaf, TrendingUp, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
interface GuestDashboardProps {
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

export default function GuestDashboard({ baseJenisRumputLaut, totalDataPanen, indikator, transactionY }: GuestDashboardProps) {
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
    useEffect(() => {
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
    }, [baseJenisRumputLaut]);
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };
    return (
        <UserAuthLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-foreground">Hydroponic Dashboard</h1>
                    <p className="mt-1 text-muted-foreground">Monitor and maintain optimal growing conditions</p>
                </header>
                {/* Statistik */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="col-span-1">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
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
                    </motion.div>
                    {/* Hero Section */}
                    <motion.div className="mx-auto max-w-7xl" variants={staggerContainer} initial="initial" animate="animate">

                        <motion.h1 variants={fadeInUp} className="mb-6 text-2xl leading-tight font-bold text-gray-900 md:text-2xl">
                            Sistem Prediksi
                            <span className="text-teal-600"> Panen Rumput Laut</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mb-8 text-base leading-relaxed text-gray-600 md:text-2xl">
                            Didukung oleh <span className="font-semibold text-teal-700">FP-Growth</span> &{' '}
                            <span className="font-semibold text-blue-700">Multiple Linear Regression</span> Models
                        </motion.p>
                        <motion.p variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-lg text-gray-500">
                            Manfaatkan kekuatan algoritma canggih untuk memprediksi hasil panen rumput laut dengan presisi, optimalkan operasi
                            budidaya laut Anda, dan maksimalkan potensi panen.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={route('user.form.prediksi')}>
                                <Button size="lg" className="bg-teal-600 px-8 py-3 text-white hover:bg-teal-700">
                                    Mulai Prediksi
                                    <TrendingUp className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                           <Link href={route('user.riwayatPengguna.index')}>
                            <Button variant="outline" size="lg" className="border-teal-200 px-8 py-3 text-teal-700 hover:bg-teal-50">
                                Riwayat Prediksi
                                <Eye className="ml-2 h-5 w-5" />
                            </Button>
                           </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </UserAuthLayout>
    );
}
