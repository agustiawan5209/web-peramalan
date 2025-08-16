import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FPGrowth } from 'node-fpgrowth';
import React, { useEffect, useRef, useState } from 'react';

// Type for association rules
interface AssociationRule {
    antecedent: string[];
    consequent: string;
    confidence: number; // percentage
    support: number; // percentage
}

// Component props
interface FPGrowthProps {
    transactions: string[][];
    support_threshold: number;
    confidence_threshold: number;
    setSupportThreshold: (value: number) => void;
    setConfidenceThreshold: (value: number) => void;
    setAssociationResult?: (value: { name: string; count: number }[]) => void;
    title: string;
}

const FPGrowthComponent: React.FC<FPGrowthProps> = ({
    transactions,
    support_threshold,
    confidence_threshold,
    setSupportThreshold,
    setConfidenceThreshold,
    setAssociationResult,
    title,
}) => {
    // State for rules and loading status
    const [rules, setRules] = useState<AssociationRule[]>([]);
    // State untuk menyimpan indikator paling berpengaruh
    const [topIndicators, setTopIndicators] = useState<{
        antecedents: { name: string; count: number }[];
        consequents: { name: string; count: number }[];
        overall: { name: string; count: number }[];
    }>({ antecedents: [], consequents: [], overall: [] });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Run FP-Growth algorithm
    const runFPGrowth = async () => {
        // Clear previous timer and error
        if (timerRef.current) clearTimeout(timerRef.current);
        setError(null);

        // Set loading after delay to prevent flickering on quick operations
        timerRef.current = setTimeout(() => setIsLoading(true), 1000);

        try {
            // Validate inputs
            if (transactions.length === 0) {
                throw new Error('Tidak ada transaksi untuk diproses');
            }

            // 1. Run FP-Growth algorithm
            const fpgrowth = new FPGrowth<string>(support_threshold / 100); // Convert percentage to decimal
            const frequentItemsets = await fpgrowth.exec(transactions);
            const totalTransactions = transactions.length;

            // 2. Create support map with percentages
            const supportMap = new Map<string, number>();
            frequentItemsets.forEach((itemset) => {
                const supportPercentage = (itemset.support / totalTransactions) * 100;
                supportMap.set(itemset.items.sort().join(','), supportPercentage);
            });

            // 3. Generate association rules
            const generatedRules: AssociationRule[] = [];
            const processedCombinations = new Set<string>();
            frequentItemsets.forEach((itemset) => {
                // Skip itemsets with less than 2 items (can't form rules)
                if (itemset.items.length < 2) return;

                const items = itemset.items;
                // Generate all non-empty proper subsets
                for (let mask = 1; mask < (1 << items.length) - 1; mask++) {
                    const antecedent: string[] = [];
                    const consequent: string[] = [];

                    // Split items into antecedent and consequent
                    for (let i = 0; i < items.length; i++) {
                        if (mask & (1 << i)) {
                            antecedent.push(items[i]);
                        } else {
                            consequent.push(items[i]);
                        }
                    }

                    // We only want single-item consequents
                    if (consequent.length !== 1) continue;

                    // Avoid processing duplicate combinations
                    const combinationKey = [...antecedent, ...consequent].sort().join(',');
                    if (processedCombinations.has(combinationKey)) continue;
                    processedCombinations.add(combinationKey);

                    // Get antecedent support
                    const antecedentKey = antecedent.sort().join(',');
                    const antecedentSupport = supportMap.get(antecedentKey);
                    if (!antecedentSupport) continue;

                    // Calculate confidence (as percentage)
                    const confidence = (itemset.support / ((antecedentSupport * totalTransactions) / 100)) * 100;

                    // Only keep rules that meet confidence threshold
                    if (confidence >= confidence_threshold) {
                        generatedRules.push({
                            antecedent,
                            consequent: consequent[0],
                            confidence,
                            support: (itemset.support / totalTransactions) * 100,
                        });
                    }
                }
            });
            const targetConsequents = ['hasil_panen_tinggi', 'hasil_panen_rendah', 'hasil_panen_sedang'];
            // 4. sort
            const filteredRules = generatedRules
                // .filter((rule) => targetConsequents.includes(rule.consequent))
                .sort((a, b) => b.confidence - a.confidence || b.support - a.support);

            // 5. Hitung indikator paling berpengaruh
            const indicatorStats = analyzeIndicators(filteredRules);
            setTopIndicators(indicatorStats);

            setRules(filteredRules);
            if (setAssociationResult) {
                setAssociationResult(indicatorStats.antecedents);
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat memproses data');
            console.error('FP-Growth Error:', e);
        } finally {
            setIsLoading(false);
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        runFPGrowth();
    }, [transactions]);
    const analyzeIndicators = (rules: AssociationRule[]) => {
        // 1. Inisialisasi struktur data
        const antecedentStats: Record<string, { count: number; confidenceSum: number; supportSum: number }> = {};
        const consequentStats: Record<string, { count: number; confidenceSum: number; supportSum: number }> = {};
        const overallStats: Record<string, { count: number; confidenceSum: number; supportSum: number }> = {};

        // 2. Proses semua rules dan kumpulkan statistik
        rules.forEach((rule) => {
            const { antecedent, consequent, confidence, support } = rule;

            // Proses antecedent (bisa multiple items)
            antecedent.forEach((item) => {
                if (!antecedentStats[item]) {
                    antecedentStats[item] = { count: 0, confidenceSum: 0, supportSum: 0 };
                }
                antecedentStats[item].count += 1;
                antecedentStats[item].confidenceSum += confidence;
                antecedentStats[item].supportSum += support;

                // Proses overall
                if (!overallStats[item]) {
                    overallStats[item] = { count: 0, confidenceSum: 0, supportSum: 0 };
                }
                overallStats[item].count += 1;
                overallStats[item].confidenceSum += confidence;
                overallStats[item].supportSum += support;
            });

            // Proses consequent (single item)
            if (!consequentStats[consequent]) {
                consequentStats[consequent] = { count: 0, confidenceSum: 0, supportSum: 0 };
            }
            consequentStats[consequent].count += 1;
            consequentStats[consequent].confidenceSum += confidence;
            consequentStats[consequent].supportSum += support;

            // Proses overall untuk consequent
            if (!overallStats[consequent]) {
                overallStats[consequent] = { count: 0, confidenceSum: 0, supportSum: 0 };
            }
            overallStats[consequent].count += 1;
            overallStats[consequent].confidenceSum += confidence;
            overallStats[consequent].supportSum += support;
        });

        // 3. Fungsi sorting yang mempertimbangkan count, confidence, dan support
        const sortByImpact = (
            a: { name: string; count: number; avgConfidence: number; avgSupport: number },
            b: { name: string; count: number; avgConfidence: number; avgSupport: number },
        ) => {
            // Prioritas 1: Confidence rata-rata
            if (b.avgConfidence !== a.avgConfidence) return b.avgConfidence - a.avgConfidence;
            // Prioritas 2: Support rata-rata
            if (b.avgSupport !== a.avgSupport) return b.avgSupport - a.avgSupport;
            // Prioritas 3: Frekuensi kemunculan
            return b.count - a.count;
        };

        // 4. Konversi ke array dan hitung rata-rata
        const processStats = (stats: Record<string, { count: number; confidenceSum: number; supportSum: number }>) => {
            return Object.entries(stats)
                .filter(([name]) => !name.includes('hasil')) // Filter out hasil_panen
                .map(([name, { count, confidenceSum, supportSum }]) => ({
                    name,
                    count,
                    avgConfidence: confidenceSum / count,
                    avgSupport: supportSum / count,
                    weightedScore: (confidenceSum * 0.6 + supportSum * 0.4) / count, // Bobot: confidence 60%, support 40%
                }))
                .sort(sortByImpact);
        };

        // 5. Proses masing-masing kategori
        const antecedents = processStats(antecedentStats).slice(0, 5);
        const consequents = processStats(consequentStats).slice(0, 8);
        const overall = processStats(overallStats).slice(0, 5);

        return {
            antecedents,
            consequents,
            overall,
            // Tambahan: rule dengan confidence dan support tertinggi
            highestConfidenceRule: rules.length > 0 ? [...rules].sort((a, b) => b.confidence - a.confidence || b.support - a.support)[0] : null,
            highestSupportRule: rules.length > 0 ? [...rules].sort((a, b) => b.support - a.support || b.confidence - a.confidence)[0] : null,
        };
    };
    return (
        <div className="max-w-auto mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Status Messages */}
            {transactions.length === 0 && (
                <div className="mb-6 rounded-md bg-yellow-50 p-4 text-yellow-800">Tidak ada data transaksi untuk diproses</div>
            )}

            {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">{error}</div>}

            {/* Results */}
            {!isLoading && rules.length > 0 && (
                <div className="space-y-8">
                    {/* All Rules */}
                    <div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">
                            Aturan {title} ({rules.length} ditemukan)
                        </h3>
                        <div className="overflow-x-auto">
                            <Table className="min-w-full divide-y divide-gray-200">
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-2/3">Aturan</TableHead>
                                        <TableHead className="text-center">Confidence</TableHead>
                                        <TableHead className="text-center">Support</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-200">
                                    {rules.slice(0, 50).map((rule, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="py-3">
                                                <span className="font-medium">Jika </span>
                                                <span className="font-semibold text-blue-600">{rule.antecedent.join(' ∧ ')}</span>
                                                <span className="font-medium"> maka </span>
                                                <span className="font-semibold text-green-600">{rule.consequent}</span>
                                            </TableCell>
                                            <TableCell className="text-center">{rule.confidence.toFixed(1)}%</TableCell>
                                            <TableCell className="text-center">{rule.support.toFixed(1)}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {/* <div className="indicator-stats">
                                <div className="stat-card">
                                    <h3>Top Antecedents</h3>
                                    <ul>
                                        {topIndicators.antecedents.map((item, i) => (
                                            <li key={i}>
                                                {item.name}: {item.count} rules
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="stat-card">
                                    <h3>Top Consequents</h3>
                                    <ul>
                                        {topIndicators.consequents.map((item, i) => (
                                            <li key={i}>
                                                {item.name}: {item.count} rules
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="stat-card">
                                    <h3>Most Frequent Indicators</h3>
                                    <ul>
                                        {topIndicators.overall.map((item, i) => (
                                            <li key={i}>
                                                {item.name}: {item.count} occurrences
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && rules.length === 0 && transactions.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">Tidak ada aturan yang ditemukan dengan threshold saat ini.</p>
                    <p className="mt-2 text-sm text-gray-500">Coba turunkan nilai support atau confidence threshold.</p>
                </div>
            )}
        </div>
    );
};

export default FPGrowthComponent;
