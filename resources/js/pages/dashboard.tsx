import ModelCard from '@/components/dashboard/ModelCard';
import PredictionChart from '@/components/dashboard/PredictionChart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Activity, Database, Leaf, TrendingUp } from 'lucide-react';
// Import the default export from each file
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const stats = [
        { title: 'Total Data Panen', value: '1,245', icon: <Database size={24} />, change: '+12%' },
        { title: 'Model Tersedia', value: '3', icon: <Leaf size={24} />, change: '+1 baru' },
        { title: 'Akurasi Terbaik', value: '92%', icon: <TrendingUp size={24} />, change: '+2%' },
        { title: 'Prediksi Bulan Ini', value: '156', icon: <Activity size={24} />, change: '+8%' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Prediksi Panen Rumput Laut</h1>

                {/* Statistik */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2"
                    >
                        <h2 className="mb-4 text-lg font-semibold">Prediksi Panen 6 Bulan Mendatang</h2>
                        <PredictionChart />
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-4">
                        <ModelCard title="Regresi Linear Berganda" accuracy={0.92} lastUpdated="2 hari lalu" />
                        <ModelCard title="FP-Growth" accuracy={0.88} lastUpdated="1 minggu lalu" />
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
