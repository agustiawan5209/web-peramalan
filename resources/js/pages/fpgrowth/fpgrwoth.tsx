import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FPGrowth, Itemset } from 'node-fpgrowth';
import React, { useState } from 'react';

// Tipe untuk props komponen
interface FPGrowthProps {
    transactions: string[][];
    support_threshold: number;
    confidence_threshold: number;
    setSupportThreshold: (value: number) => void;
    setConfidenceThreshold: (value: number) => void;
}

// Tipe untuk aturan asosiasi yang akan ditampilkan
interface AssociationRule {
    antecedent: string[];
    consequent: string;
    confidence: number;
    support: number;
}
const FPGrowthComponent: React.FC<FPGrowthProps> = ({
    transactions,
    support_threshold,
    confidence_threshold,
    setSupportThreshold,
    setConfidenceThreshold,
}) => {
    const [associationRules, setAssociationRules] = useState<AssociationRule[]>([]);
    const [associationRulesPanenRendah, setAssociationRulesPanenRendah] = useState<AssociationRule[]>([]);
    const [associationRulesPanenSedang, setAssociationRulesPanenSedang] = useState<AssociationRule[]>([]);
    const [associationRulesPanenTinggi, setAssociationRulesPanenTinggi] = useState<AssociationRule[]>([]);
    // State untuk loading dan error
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const AlgoritmaFPGrowth = async () => {
        const timer = setTimeout(() => {
            setIsLoading(true);
            console.log('AlgoritmaFPGrowth dijalankan setelah 1 detik');
        }, 1000);
        console.log('Timer untuk AlgoritmaFPGrowth di-set');
        console.log('Mulai AlgoritmaFPGrowth - loading awal:', isLoading); // Debug 1

        console.log('Set loading true - loading sekarang:', true); // Debug 2

        setAssociationRules([]);
        setError(null);

        try {
            console.log('Menjalankan Algoritma FP-Growth dengan threshold:', support_threshold, confidence_threshold); // Debug 3
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

            // 4. Mengurutkan aturan berdasarkan confidence dan support
            filteredRules.sort((a, b) => {
                if (b.confidence !== a.confidence) {
                    return b.confidence - a.confidence; // Urut berdasarkan confidence
                }
                return b.support - a.support; // Jika confidence sama, urut berdasarkan support
            });
            // 5. Memisahkan aturan berdasarkan konsekuen
            const panenTinggiRules = filteredRules.filter((rule) => rule.consequent === 'Panen_Tinggi');
            const panenRendahRules = filteredRules.filter((rule) => rule.consequent === 'Panen_Rendah');
            const panenSedangRules = filteredRules.filter((rule) => rule.consequent === 'Panen_Sedang');
            // 6. Update state dengan aturan yang ditemukan
            setAssociationRulesPanenTinggi(panenTinggiRules);
            setAssociationRulesPanenRendah(panenRendahRules);
            setAssociationRulesPanenSedang(panenSedangRules);
            console.log('Set aturan asosiasi - jumlah aturan:', filteredRules.length); // Debug 3
            console.log('Aturan Panen Tinggi:', panenTinggiRules); // Debug 4
            console.log('Aturan Panen Sedang:', panenSedangRules); // Debug 5
            console.log('Aturan Panen Rendah:', panenRendahRules); // Debug 6
            // Update state dengan aturan yang ditemukan
            setAssociationRules(filteredRules);
        } catch (e) {
            setError('Terjadi kesalahan saat memproses data.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }

        return clearTimeout(timer); // Hapus timer setelah selesai
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-4">
                <h2 className="text-3xl leading-tight font-bold">Hasil Aturan Asosiasi FP-Growth</h2>
                <p className="text-xs text-chart-2">
                    Peringatan!!: Proses Ini Mungkin Memakan Waktu Lama Jika Jumlah Hasil Panen Dari Data Terlalu Besar
                </p>
                <p className="text-xs text-chart-1">
                    Support Threshold: Nilai minimum agar itemset dianggap sebagai aturan asosiasi yang berarti.<br />
                    Confidence Threshold: Nilai minimum agar aturan asosiasi dianggap sebagai aturan yang berlaku.
                </p>
            </div>
            <div className="flex flex-row justify-start items-center gap-2">
                <div className="flex flex-row items-center gap-1">
                    <Label htmlFor="support_threshold" className='whitespace-nowrap'>Support Threshold</Label>
                    <Input value={support_threshold} onChange={(e) => setSupportThreshold(Number(e.target.value))} type="number" step={0.1} />
                </div>
                <div className="flex flex-row items-center gap-1">
                    <Label htmlFor="confidence_threshold" className='whitespace-nowrap'>Confidence Threshold</Label>
                    <Input value={confidence_threshold} onChange={(e) => setConfidenceThreshold(Number(e.target.value))} type="number" step={0.1} />
                </div>
                <button
                    onClick={AlgoritmaFPGrowth}
                    disabled={isLoading}
                    className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="border-opacity-50 h-4 w-4 animate-spin rounded-full border-t-2 border-white"></span>
                            FP-Growth Sedang Berjalan...
                        </span>
                    ) : (
                        'Jalankan FP-Growth'
                    )}
                </button>
            </div>
            <div>
                {isLoading && <p className="text-gray-600">Memproses aturan...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!isLoading && !error && associationRules.length === 0 && (
                    <p className="text-gray-600">Tidak ada aturan yang ditemukan dengan threshold yang diberikan.</p>
                )}

                {!isLoading && !error && associationRules.length > 0 && (
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead scope="col" colSpan={3} className="text-left">
                                    Jumlah Aturan : {associationRules.length} Aturan Ditemukan
                                </TableHead>
                            </TableRow>
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
                            {associationRules.slice(0, 10).map((rule, index) => (
                                <TableRow key={index}>
                                    <TableCell className="px-6 py-4">
                                        <span className="font-medium text-gray-900">Jika </span>
                                        <span className="font-medium text-gray-900">{rule.antecedent.join(' & ')}</span>
                                        <span className="font-medium text-gray-900">, maka </span>
                                        <span className="font-medium text-gray-900">{rule.consequent}</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{Math.round(rule.confidence * 100)}%</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-4">
                                        <span className="font-medium text-gray-900">{rule.support}%</span>
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
