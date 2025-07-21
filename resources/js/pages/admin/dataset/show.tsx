import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
};

const capitalize = (str: string) => {
    return str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const getWaterQualityColor = (ph: number) => {
    if (ph < 6.5) return 'bg-red-100 text-red-800';
    if (ph < 7.5) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
};

interface HarvestDetailProps {
    dataset: DatasetTypes;
    breadcrumb: BreadcrumbItem[];
    titlePage: string;
}
export default function HarvestDetailPage({ dataset, breadcrumb, titlePage }: HarvestDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const [data] = useState<DatasetTypes>(dataset);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Detail'} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Detail Dataset</h1>
                    </motion.div>

                    {/* Summary Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-10 grid grid-cols-1"
                    >
                        {/* Cultivation Data */}
                        <div className="overflow-hidden border-l-4 border-b-4 border-primary bg-white p-6 shadow-md">
                            <h3 className="text-lg font-medium text-gray-500">Data Kelas</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-base text-gray-600">Jenis Tanaman</span>
                                    <span className="text-base font-medium">{data.jenis_tanaman} Ha</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-base text-gray-600">Label (Nutrisi)</span>
                                    <span className="text-base font-medium">{data.label}</span>
                                </div>
                            </div>
                        </div>

                        {/* Water Quality */}
                        <div className="overflow-hidden border-l-4 border-chart-4 bg-white p-6 shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Detail Tanaman</h3>
                            <div className="mt-4 space-y-3">
                                {data.detail.map((item, index) => (
                                    <div key={index} className="flex justify-between border-b-2">
                                        <span className="text-base text-gray-800">{item.kriteria.nama}</span>
                                        <span className="text-base font-medium">{item.nilai}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </AppLayout>
    );
}
