import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, HasilPanenTypes, ParameterHasilPanenTypes } from '@/types';
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
    hasilPanen: HasilPanenTypes;
    breadcrumb: BreadcrumbItem[];
    titlePage: string;
}
export default function HarvestDetailPage({ hasilPanen, breadcrumb, titlePage }: HarvestDetailProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const [data] = useState<HasilPanenTypes>(hasilPanen);
    const jenisRumputLaut: Array<{ nama: string; jumlah: number }> = JSON.parse(data.jenisRumputLaut)
    const parameter : ParameterHasilPanenTypes = JSON.parse(hasilPanen.parameter);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Detail'} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="mb-10 text-center">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Detail Hasil Panen Rumput Laut</h1>
                        <p className="text-lg text-gray-600">
                            Periode {capitalize(data.bulan)} {data.tahun}
                        </p>
                    </motion.div>

                    {/* Summary Cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3"
                    >
                        {/* Total Harvest */}
                        <div className="overflow-hidden rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Total Panen</h3>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">{formatNumber(data.total_panen)} kg</p>
                            <div className="mt-4">
                                {Array.isArray(jenisRumputLaut) && jenisRumputLaut.map((jenis, index) => (
                                    <div key={index} className="flex justify-between py-1">
                                        <span className="text-sm text-gray-600">{capitalize(jenis.nama)}</span>
                                        <span className="text-sm font-medium">{formatNumber(jenis.jumlah)} kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cultivation Data */}
                        <div className="overflow-hidden rounded-xl border-l-4 border-green-500 bg-white p-6 shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Data Budidaya</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Luas Tanam</span>
                                    <span className="text-sm font-medium">{formatNumber(parameter.luasTanam)} Ha</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Jumlah Tali</span>
                                    <span className="text-sm font-medium">{formatNumber(parameter.jumlahTali)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Jumlah Bibit</span>
                                    <span className="text-sm font-medium">{formatNumber(parameter.jumlahBibit)} kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Water Quality */}
                        <div className="overflow-hidden rounded-xl border-l-4 border-purple-500 bg-white p-6 shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">Kualitas Air</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Suhu Air</span>
                                    <span className="text-sm font-medium">{parameter.suhuAir} °C</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Salinitas</span>
                                    <span className="text-sm font-medium">{parameter.salinitas} ppt</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">pH Air</span>
                                    <span className={`rounded-full px-2 py-1 text-sm font-medium ${getWaterQualityColor(parameter.phAir)}`}>
                                        {parameter.phAir}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Detailed Parameters */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-10 overflow-hidden rounded-xl bg-white shadow-md"
                    >
                        <div className="border-b border-gray-200 px-6 py-5">
                            <h3 className="text-lg font-medium text-gray-900">Parameter Lingkungan</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Panjang Garis Pantai</p>
                                    <p className="mt-1 text-sm font-medium">{formatNumber(parameter.panjangGarisPantai)} km</p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Jumlah Petani</p>
                                    <p className="mt-1 text-sm font-medium">{formatNumber(parameter.jumlahPetani)} orang</p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Luas Potensi Lahan</p>
                                    <p className="mt-1 text-sm font-medium">{formatNumber(parameter.luasPotensi)} Ha</p>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Kejernihan Air</p>
                                    <p className="mt-1 text-sm font-medium">{parameter.kejernihanAir}</p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Cahaya Matahari</p>
                                    <p className="mt-1 text-sm font-medium">{parameter.cahayaMatahari}</p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Arus Air</p>
                                    <p className="mt-1 text-sm font-medium">{parameter.arusAir}</p>
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-3 md:divide-x md:divide-y-0">
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Kedalaman Air</p>
                                    <p className="mt-1 text-sm font-medium">{formatNumber(parameter.kedalamanAir)} m</p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Ketersediaan Nutrisi</p>
                                    <p className="mt-1 text-sm font-medium">{parameter.ketersediaanNutrisi}</p>
                                </div>
                                <div className="px-6 py-4">
                                    <p className="text-sm text-gray-500">Produktivitas</p>
                                    <p className="mt-1 text-sm font-medium">
                                        {parameter.luasTanam > 0 ? `${formatNumber(data.total_panen / parameter.luasTanam)} kg/Ha` : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Visualization Placeholder */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mb-10 overflow-hidden rounded-xl bg-white p-6 shadow-md"
                    >
                        <h3 className="mb-4 text-lg font-medium text-gray-900">Visualisasi Data</h3>
                        <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                            <p className="text-gray-500">Grafik produksi akan ditampilkan di sini</p>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="text-center text-sm text-gray-500"
                    >
                        <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
                    </motion.div>
                </div>
            </motion.div>
        </AppLayout>
    );
}
