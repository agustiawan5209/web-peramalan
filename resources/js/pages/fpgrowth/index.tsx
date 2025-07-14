import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useMemo } from 'react';
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
    const supportThreshold = 0.3;
    const confidenceThreshold = 0.7;

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="fp-growth-container rounded-lg bg-white p-4 shadow-lg">
                    <h2 className="mb-4 text-2xl font-bold">FP-Growth Algorithm in React TypeScript</h2>

                  <FPGrowthComponent
        transactions={transactions}
        support_threshold={supportThreshold}
        confidence_threshold={confidenceThreshold}
      />
                </div>
            </AppLayout>
        </>
    );
}
