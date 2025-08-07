import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
}

const FPGrowthComponent: React.FC<FPGrowthProps> = ({
    transactions,
    support_threshold,
    confidence_threshold,
    setSupportThreshold,
    setConfidenceThreshold,
}) => {
    // State for rules and loading status
    const [rules, setRules] = useState<{
        all: AssociationRule[];
        tinggi: AssociationRule[];
        rendah: AssociationRule[];
        sedang: AssociationRule[];
    }>({ all: [], tinggi: [], rendah: [], sedang: [] });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout>(null);

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
            console.log(generatedRules)

            // 4. Filter for our target consequents and sort
            const targetConsequents = ['hasil_panen_sedang', 'hasil_panen_rendah', 'hasil_panen_sedang'];
            const filteredRules = generatedRules
                .filter((rule) => targetConsequents.includes(rule.consequent))
                .sort((a, b) => b.confidence - a.confidence || b.support - a.support);

            // 5. Categorize rules by consequent type
            setRules({
                all: filteredRules,
                tinggi: filteredRules.filter((rule) => rule.consequent === 'hasil_panen_sedang'),
                rendah: filteredRules.filter((rule) => rule.consequent === 'hasil_panen_rendah'),
                sedang: filteredRules.filter((rule) => rule.consequent === 'hasil_panen_sedang'),
            });
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
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hasil Aturan Asosiasi FP-Growth</h2>
                <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium text-yellow-600">Peringatan: Proses ini mungkin memakan waktu lama jika data transaksi sangat besar</p>
                    <p className="mt-1">
                        <span className="font-semibold">Support Threshold:</span> Minimum support (0-100%) untuk itemset dianggap frequent
                    </p>
                    <p>
                        <span className="font-semibold">Confidence Threshold:</span> Minimum confidence (0-100%) untuk aturan dianggap valid
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="support_threshold" className="w-40">
                            Support Threshold (%)
                        </Label>
                        <Input
                            id="support_threshold"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={support_threshold}
                            onChange={(e) => setSupportThreshold(Math.min(100, Math.max(0, Number(e.target.value))))}
                            className="w-24"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="confidence_threshold" className="w-40">
                            Confidence Threshold (%)
                        </Label>
                        <Input
                            id="confidence_threshold"
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={confidence_threshold}
                            onChange={(e) => setConfidenceThreshold(Math.min(100, Math.max(0, Number(e.target.value))))}
                            className="w-24"
                        />
                    </div>
                </div>

                <button
                    onClick={runFPGrowth}
                    disabled={isLoading || transactions.length === 0}
                    className={`rounded-md px-4 py-2 font-medium text-white ${
                        isLoading || transactions.length === 0 ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                            Memproses...
                        </span>
                    ) : (
                        'Jalankan FP-Growth'
                    )}
                </button>
            </div>

            {/* Status Messages */}
            {transactions.length === 0 && (
                <div className="mb-6 rounded-md bg-yellow-50 p-4 text-yellow-800">Tidak ada data transaksi untuk diproses</div>
            )}

            {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">{error}</div>}

            {/* Results */}
            {!isLoading && rules.all.length > 0 && (
                <div className="space-y-8">
                    {/* All Rules */}
                    <div>
                        <h3 className="mb-2 text-lg font-medium text-gray-900">Semua Aturan ({rules.all.length} ditemukan)</h3>
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
                                    {rules.all.slice(0, 50).map((rule, index) => (
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
                        </div>
                    </div>

                    {/* Rules by Category */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Panen Tinggi */}
                        <div className="overflow-hidden rounded-lg border">
                            <div className="border-b bg-green-50 p-3">
                                <h4 className="font-medium text-green-800">Panen Tinggi ({rules.tinggi.length} aturan)</h4>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {rules.tinggi.length > 0 ? (
                                    <Table>
                                        <TableBody>
                                            {rules.tinggi.slice(0, 10).map((rule, index) => (
                                                <TableRow key={`tinggi-${index}`}>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="text-sm">
                                                            <span className="font-medium">Jika </span>
                                                            {rule.antecedent.join(' ∧ ')}
                                                        </div>
                                                        <div className="mt-1 flex justify-between text-xs">
                                                            <span>C: {rule.confidence.toFixed(1)}%</span>
                                                            <span>S: {rule.support.toFixed(1)}%</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500">Tidak ada aturan untuk Panen Tinggi</div>
                                )}
                            </div>
                        </div>

                        {/* Panen Sedang */}
                        <div className="overflow-hidden rounded-lg border">
                            <div className="border-b bg-yellow-50 p-3">
                                <h4 className="font-medium text-yellow-800">Panen Sedang ({rules.sedang.length} aturan)</h4>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {rules.sedang.length > 0 ? (
                                    <Table>
                                        <TableBody>
                                            {rules.sedang.slice(0, 10).map((rule, index) => (
                                                <TableRow key={`sedang-${index}`}>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="text-sm">
                                                            <span className="font-medium">Jika </span>
                                                            {rule.antecedent.join(' ∧ ')}
                                                        </div>
                                                        <div className="mt-1 flex justify-between text-xs">
                                                            <span>C: {rule.confidence.toFixed(1)}%</span>
                                                            <span>S: {rule.support.toFixed(1)}%</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500">Tidak ada aturan untuk Panen Sedang</div>
                                )}
                            </div>
                        </div>

                        {/* Panen Rendah */}
                        <div className="overflow-hidden rounded-lg border">
                            <div className="border-b bg-red-50 p-3">
                                <h4 className="font-medium text-red-800">Panen Rendah ({rules.rendah.length} aturan)</h4>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {rules.rendah.length > 0 ? (
                                    <Table>
                                        <TableBody>
                                            {rules.rendah.slice(0, 10).map((rule, index) => (
                                                <TableRow key={`rendah-${index}`}>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="text-sm">
                                                            <span className="font-medium">Jika </span>
                                                            {rule.antecedent.join(' ∧ ')}
                                                        </div>
                                                        <div className="mt-1 flex justify-between text-xs">
                                                            <span>C: {rule.confidence.toFixed(1)}%</span>
                                                            <span>S: {rule.support.toFixed(1)}%</span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500">Tidak ada aturan untuk Panen Rendah</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && rules.all.length === 0 && transactions.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">Tidak ada aturan yang ditemukan dengan threshold saat ini.</p>
                    <p className="mt-2 text-sm text-gray-500">Coba turunkan nilai support atau confidence threshold.</p>
                </div>
            )}
        </div>
    );
};

export default FPGrowthComponent;
