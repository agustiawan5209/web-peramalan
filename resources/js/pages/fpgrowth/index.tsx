import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import FPGrowthComponent from './fpgrwoth';

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
    const [supportThreshold, setSupportThreshold] = useState(20);
    const [confidenceThreshold, setConfidenceThreshold] = useState(20);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={titlePage} />
                <div className="fp-growth-container rounded-lg bg-white p-4 shadow-lg">
                    {transactions.length > 0 ? (
                        <FPGrowthComponent
                                transactions={transactions}
                                support_threshold={supportThreshold}
                                confidence_threshold={confidenceThreshold}
                                setConfidenceThreshold={setConfidenceThreshold}
                                setSupportThreshold={setSupportThreshold}
                            />
                    ) : (
                        <h2 className="mb-4 text-2xl font-bold text-destructive">Peringatan : Data Hasil Panen Harus lebih dari 5</h2>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
