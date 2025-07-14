import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FPGrowth, Itemset } from 'node-fpgrowth';
import React, { useState } from 'react';

// Tipe untuk props komponen
interface FPGrowthProps {
    transactions: string[][];
    support_threshold: number;
    confidence_threshold: number;
}

// Tipe untuk aturan asosiasi yang akan ditampilkan
interface AssociationRule {
    antecedent: string[];
    consequent: string;
    confidence: number;
    support: number;
}

const FPGrowthComponent: React.FC<FPGrowthProps> = ({ transactions, support_threshold, confidence_threshold }) => {
    const [associationRules, setAssociationRules] = useState<AssociationRule[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const AlgoritmaFPGrowth = async () => {
        setLoading(true);
        setAssociationRules([]);
        setError(null);

        try {
            if (loading) {
                // 1. Menjalankan algoritma FP-Growth untuk mendapatkan itemset yang sering muncul
                const fpgrowth = new FPGrowth<string>(support_threshold);
                const frequentItemsets: Itemset<string>[] = await fpgrowth.exec(transactions);

                // Membuat peta support untuk setiap itemset untuk perhitungan confidence
                const supportMap = new Map<string, number>();
                frequentItemsets.forEach((itemset) => {
                    supportMap.set(itemset.items.sort().join(','), itemset.support);
                });

                // 2. Menghasilkan Aturan Asosiasi dari Frequent Itemsets
                const generatedRules: AssociationRule[] = [];
                frequentItemsets.forEach((itemset) => {
                    if (itemset.items.length > 1) {
                        // Membuat semua kemungkinan subset dari itemset
                        for (let i = 0; i < 1 << itemset.items.length; i++) {
                            const subset: string[] = [];
                            for (let j = 0; j < itemset.items.length; j++) {
                                if ((i & (1 << j)) > 0) {
                                    subset.push(itemset.items[j]);
                                }
                            }

                            if (subset.length > 0 && subset.length < itemset.items.length) {
                                const antecedent = subset;
                                const consequent = itemset.items.filter((item) => !subset.includes(item));

                                // Hanya proses aturan dengan satu item sebagai konsekuen
                                if (consequent.length === 1) {
                                    const antecedentSupport = supportMap.get(antecedent.sort().join(','));
                                    if (antecedentSupport) {
                                        const confidence = itemset.support / antecedentSupport;

                                        if (confidence >= confidence_threshold) {
                                            generatedRules.push({
                                                antecedent: antecedent,
                                                consequent: consequent[0],
                                                confidence: confidence,
                                                support: itemset.support,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                });

                // 3. Filter aturan untuk menampilkan yang menuju ke 'Panen_Tinggi', 'Panen_Rendah', dan 'Panen_Sedang'
                const targetConsequents = ['Panen_Tinggi', 'Panen_Rendah', 'Panen_Sedang'];
                const filteredRules = generatedRules.filter((rule) => targetConsequents.includes(rule.consequent));

                setAssociationRules(filteredRules.slice(0, 10));
            }
        } catch (e) {
            setError('Terjadi kesalahan saat memproses data.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Jalankan AlgoritmaFPGrowth hanya saat tombol diklik
    // Tidak perlu useEffect untuk loading

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-4">
                <h2 className="text-3xl leading-tight font-bold">Hasil Aturan Asosiasi FP-Growth</h2>
                <p className="text-xs text-chart-2">
                    Peringatan!!: Proses Ini Mungkin Memakan Waktu Lama Jika Jumlah Hasil Panen Dari Data Terlalu Besar Peringatan!!: Proses Ini
                    Mungkin Memakan Waktu Lama Jika Jumlah Hasil Panen Dari Data Terlalu Besar
                </p>
            </div>
            <button
                onClick={AlgoritmaFPGrowth}
                disabled={loading}
                className="mb-4 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="border-opacity-50 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                        Fp-growth Sedang Berjalan...
                    </span>
                ) : (
                    'Jalankan Fp-growth'
                )}
            </button>
            <div>
                {loading && <p className="text-gray-600">Memproses aturan...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && !error && associationRules.length === 0 && (
                    <p className="text-gray-600">Tidak ada aturan yang ditemukan dengan threshold yang diberikan.</p>
                )}

                {!loading && !error && associationRules.length > 0 && (
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead scope="col" className="text-center">
                                    Aturan (Jika... maka...)
                                </TableHead>
                                <TableHead scope="col" className="text-center">
                                    Confidence
                                </TableHead>
                                <TableHead scope="col" className="text-center">
                                    Support
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200 bg-white">
                            {associationRules.map((rule, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-6 py-4">
                                        <span className="font-medium text-gray-900">Jika membeli </span>
                                        <span className="font-medium text-gray-900">{rule.antecedent.join(' & ')}</span>
                                        <span className="font-medium text-gray-900">, maka akan membeli </span>
                                        <span className="font-medium text-gray-900">{rule.consequent}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{Math.round(rule.confidence * 100)}%</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{rule.support}</span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default FPGrowthComponent;
