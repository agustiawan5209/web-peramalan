import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import FPGrowth from './fpgrwoth';

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
    transaksiPanen?: string[];
}
export default function FpGrowthView({ breadcrumb, titlePage, transaksiPanen }: FpGrowthViewProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const [transactions, setTransactions] = useState<Transaction[]>(
        transaksiPanen ? transaksiPanen.map((item) => ({ items: item })) : [{ items: [] }],
    );
    const [minSupport, setMinSupport] = useState<number>(0.4);
    const [frequentItemsets, setFrequentItemsets] = useState<FrequentItemset[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const runFPGrowth = () => {
        setIsLoading(true);

        // Konversi transactions ke format yang diterima node-fpgrowth
        const transactionArrays = transactions.map((t) => t.items);

        // Jalankan algoritma FP-Growth
        const fpgrowth = new FPGrowth(minSupport);
        const result = fpgrowth.findFrequentItemsets(transactionArrays);
        console.log(result)
        // setFrequentItemsets(
        //     result.map((itemset) => ({
        //         items: itemset.items,
        //         support: itemset.support,
        //     })),
        // );
        // setIsLoading(false);
    };

    useEffect(() => {
        runFPGrowth();
    }, [transactions, minSupport]);

    const handleItemChange = (index: number, itemIndex: number, value: string) => {
        const newTransactions = [...transactions];
        newTransactions[index].items[itemIndex] = value;
        setTransactions(newTransactions);
    };

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="fp-growth-container rounded-lg bg-white p-4 shadow-lg">
                    <h2 className="mb-4 text-2xl font-bold">FP-Growth Algorithm in React TypeScript</h2>

                    <div className="controls mb-4 flex justify-between">
                        <label className="flex items-center">
                            Minimum Support:
                            <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={minSupport}
                                onChange={(e) => setMinSupport(parseFloat(e.target.value))}
                                className="ml-2 rounded-md border px-2 py-1"
                            />
                        </label>
                        <button
                            onClick={runFPGrowth}
                            disabled={isLoading}
                            className="rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            {isLoading ? 'Processing...' : 'Run FP-Growth'}
                        </button>
                    </div>

                    <div className="transactions-section mb-4 overflow-x-auto">
                        <h3 className="mb-2 text-xl font-bold">Transactions</h3>

                        {transactions.map((transaction, index) => (
                            <div key={index} className="transaction mb-2 flex items-center">
                                {transaction.items.map((item, itemIndex) => (
                                    <input
                                        key={itemIndex}
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleItemChange(index, itemIndex, e.target.value)}
                                        placeholder="Item"
                                        className="mr-2 rounded-md border px-2 py-1"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="results-section">
                        <h3 className="mb-2 text-xl font-bold">Frequent Itemsets</h3>
                        {isLoading ? (
                            <p className="text-gray-500">Calculating...</p>
                        ) : (
                            <ul className="list-disc pl-4">
                                {frequentItemsets.map((itemset, index) => (
                                    <li key={index} className="mb-2">
                                        {itemset.items.join(', ')} (Support: {(itemset.support * 100).toFixed(1)}%)
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
