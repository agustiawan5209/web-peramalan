import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useMemo, useState } from 'react';
import FPGrowthComponent from './fpgrwoth';
import { Head } from '@inertiajs/react';

interface Transaction {
    items: string[];
}

interface FrequentItemset {
    items: string[];
    support: number;
}

interface FpGrowthViewProps {
    breadcrumb: BreadcrumbItem[];
    titlePage: string;
    transaksiPanen?: string[][];
}
export default function FpGrowthView({ breadcrumb, titlePage, transaksiPanen }: FpGrowthViewProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    // Contoh data transaksi
    const transactions: string[][] = transaksiPanen || [];

    // Tentukan nilai support dan confidence threshold
    // Support: Seberapa sering itemset muncul (0.3 = 30% dari total transaksi)
    // Confidence: Seberapa sering aturan terbukti benar
    const [supportThreshold, setSupportThreshold] = useState(0.3);
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.4);

    // Jika transaksiPanen tidak diberikan, gunakan data default
    if (transactions.length === 0) {
        transactions.push(
            ['Kedalaman_Air_Rendah', 'Ketersediaan_Nutrisi_Rendah', 'Arus_Air_Rendah', 'Panen_Rendah'],
            ['Kedalaman_Air_Tinggi', 'Ketersediaan_Nutrisi_Tinggi', 'Arus_Air_Tinggi', 'Panen_Tinggi'],
            ['Kedalaman_Air_Sedang', 'Ketersediaan_Nutrisi_Sedang', 'Arus_Air_Sedang', 'Panen_Sedang'],
            ['Kedalaman_Air_Rendah', 'Ketersediaan_Nutrisi_Sedang', 'Arus_Air_Tinggi', 'Panen_Rendah'],
            ['Kedalaman_Air_Tinggi', 'Ketersediaan_Nutrisi_Rendah', 'Arus_Air_Sedang', 'Panen_Tinggi'],
            ['Kedalaman_Air_Sedang', 'Ketersediaan_Nutrisi_Tinggi', 'Arus_Air_Rendah', 'Panen_Sedang'],
        );
    }

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={titlePage} />
                <div className="fp-growth-container rounded-lg bg-white p-4 shadow-lg">
                    <h2 className="mb-4 text-2xl font-bold">FP-Growth Algorithm in React TypeScript</h2>

                    <FPGrowthComponent transactions={transactions} support_threshold={supportThreshold} confidence_threshold={confidenceThreshold} setConfidenceThreshold={setConfidenceThreshold} setSupportThreshold={setSupportThreshold} />
                </div>
            </AppLayout>
        </>
    );
}
