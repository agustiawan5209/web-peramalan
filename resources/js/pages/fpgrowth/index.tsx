import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import KMeansClustering from '@/utils/kmeans';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import FPGrowthComponent from './fpgrowth-all';

interface FpGrowthViewProps {
    breadcrumb: BreadcrumbItem[];
    titlePage: string;
    transaksiPanen?: string[][];
    transactionNumerical?: string[][];
    kriteria: {
        id: number;
        nama: string;
    }[];
}
// Type for association rules
interface AssociationRule {
    antecedent: string[];
    consequent: string;
    confidence: number; // percentage
    support: number; // percentage
}

interface ClusterResult {
    clusters: {
        rendah: string[][];
        sedang: string[][];
        tinggi: string[][];
    };
    centroids: number[][];
    associations: {
        item: string;
        influence: number;
    }[];
    featureImportance: {
        item: string;
        importance: number;
        clusterVariances: {
            rendah: number;
            sedang: number;
            tinggi: number;
        };
    }[];
    uniqueItems: string[];
}
export default function FpGrowthView({ breadcrumb, titlePage, transaksiPanen, transactionNumerical, kriteria }: FpGrowthViewProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const [kMeans, setKMeans] = useState<ClusterResult>({
        clusters: { rendah: [], sedang: [], tinggi: [] },
        centroids: [],
        associations: [],
        featureImportance: [],
        uniqueItems: [],
    });

    // Menyimpan hasil kluster dari k-means
    const [resultCluster, setResultCluster] = useState<{ rendah: string[][]; sedang: string[][]; tinggi: string[][] }>({
        rendah: [],
        sedang: [],
        tinggi: [],
    });
    // data transaksi dengan 2 dimensi
    const transactions: string[][] = transaksiPanen || [];
    const transactionsNumeric: string[][] = transactionNumerical || [];
    const clustering = new KMeansClustering(transactions);
    // const { clusters, featureImportance, associations, uniqueItems } = useKMeansClustering(transactionsNumeric);

    const runKmeans = () => {
        const result = clustering.run();
        if (result) {
            setResultCluster(result.clusters);
            const objindikator: {
                rendah: string[][];
                sedang: string[][];
                tinggi: string[][];
            } = Object.values(result.clusters).reduce(
                (acc, item: any, key) => {
                    let indikator = 'hasil_panen';

                    if (key === 0) {
                        indikator = 'hasil_panen_rendah';
                    } else if (key === 1) {
                        indikator = 'hasil_panen_sedang';
                    } else if (key === 2) {
                        indikator = 'hasil_panen_tinggi';
                    }

                    const result = item.map((val: string[]) => {
                        return val.map((items) => {
                            return items.includes('hasil_panen') ? indikator : items;
                        });
                    });

                    // Menyimpan hasil ke dalam objek akumulator berdasarkan indikator
                    if (key === 0) {
                        acc.rendah = result;
                    } else if (key === 1) {
                        acc.sedang = result;
                    } else if (key === 2) {
                        acc.tinggi = result;
                    }

                    return acc;
                },
                { rendah: [], sedang: [], tinggi: [] },
            ); // Inisialisasi objek akumulator

            setKMeans({
                clusters: objindikator,
                centroids: result.centroids,
                featureImportance: result.featureImportance,
                associations: result.associations,
                uniqueItems: result.uniqueItems,
            });
        }
    };
    // Tentukan nilai support dan confidence threshold
    // Support: Seberapa sering itemset muncul (0.3 = 30% dari total transaksi)
    // Confidence: Seberapa sering aturan terbukti benar
    const [supportThreshold, setSupportThreshold] = useState(20);
    const [confidenceThreshold, setConfidenceThreshold] = useState(70);
    const [associationRendah, setAssociationRendah] = useState<{ name: string; count: number }[]>([]);
    const [associationSedang, setAssociationSedang] = useState<{ name: string; count: number }[]>([]);
    const [associationTinggi, setAssociationTinggi] = useState<{ name: string; count: number }[]>([]);
    const [selectedIndikator, setSelectedIndikator] = useState<{ name: string; count: number }[]>([]);

    const [isSaved, setIsSaved] = useState<boolean>(false)
    useEffect(() => {
        const indikator = associationTinggi.reduce((acc, { name, count }) => {
            let nama = name.includes('_') ? name.split('_')[0] : name;
            const nameFind = kriteria.find((value) => value.nama.toLowerCase().includes(nama));

            if (nameFind) {
                nama = nameFind.nama;
            }

            // Cek apakah nama sudah ada di akumulator
            if (acc[nama]) {
                // Jika ada, tambahkan count
                acc[nama].count += count;
            } else {
                // Jika tidak ada, buat entri baru
                acc[nama] = { name: nama, count: count };
            }

            return acc;
        }, {});

        // Mengonversi objek akumulator kembali menjadi array
        const indikatorArray = Object.values(indikator);

        setSelectedIndikator(indikatorArray);
    }, [associationTinggi]);

    const submitIndikator = async () => {
        if (selectedIndikator) {
            try {
                const response = await axios.post(route('store.kriteria.model'), {
                    hasil: selectedIndikator.map((item) => item.name),
                });
                if (response.status == 200) {
                    console.log(response.data);
                    setIsSaved(true)
                }
            } catch (err) {
                console.log(err);
            }
        }
    };
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={titlePage} />

                <div className="fp-growth-container rounded-lg bg-white p-4 shadow-lg">
                    <div className="grid grid-cols-2">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Hasil Aturan Asosiasi FP-Growth</h2>
                            <div className="mt-2 text-sm text-gray-600">
                                <p className="font-medium text-yellow-600">
                                    Peringatan: Proses ini mungkin memakan waktu lama jika data transaksi sangat besar
                                </p>
                                <p className="mt-1">
                                    <span className="font-semibold">Support Threshold:</span> Minimum support (0-100%) untuk itemset dianggap frequent
                                </p>
                                <p>
                                    <span className="font-semibold">Confidence Threshold:</span> Minimum confidence (0-100%) untuk aturan dianggap
                                    valid
                                </p>
                            </div>
                        </div>
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
                                    value={supportThreshold}
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
                                    value={confidenceThreshold}
                                    onChange={(e) => setConfidenceThreshold(Math.min(100, Math.max(0, Number(e.target.value))))}
                                    className="w-24"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Button
                            onClick={runKmeans}
                            type="button"
                            variant={'default'}
                            className={`rounded-md px-4 py-2 font-medium text-white transition-colors`}
                        >
                            {'Jalankan FP-Growth'}
                        </Button>
                    </div>

                    <section className="space-y-8 rounded-xl bg-white p-6 shadow-sm">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-semibold text-gray-800">Hasil Clustering K-means</h2>

                            <div className="grid gap-6 md:grid-cols-3">
                                {/* Cluster Rendah */}
                                <div className="cluster-card rounded-lg border border-blue-100 bg-blue-50 p-4">
                                    <h3 className="mb-3 text-lg font-medium text-blue-800">
                                        Cluster Rendah <span className="text-blue-600">({kMeans.clusters.rendah.length} transaksi)</span>
                                    </h3>
                                    {/* <TransactionList transactions={kMeans.clusters.rendah.slice(0, 5)} total={kMeans.clusters.rendah.length} /> */}
                                </div>

                                {/* Cluster Sedang */}
                                <div className="cluster-card rounded-lg border border-purple-100 bg-purple-50 p-4">
                                    <h3 className="mb-3 text-lg font-medium text-purple-800">
                                        Cluster Sedang <span className="text-purple-600">({kMeans.clusters.sedang.length} transaksi)</span>
                                    </h3>
                                    {/* <TransactionList transactions={kMeans.clusters.sedang.slice(0, 5)} total={kMeans.clusters.sedang.length} /> */}
                                </div>

                                {/* Cluster Tinggi */}
                                <div className="cluster-card rounded-lg border border-green-100 bg-green-50 p-4">
                                    <h3 className="mb-3 text-lg font-medium text-green-800">
                                        Cluster Tinggi <span className="text-green-600">({kMeans.clusters.tinggi.length} transaksi)</span>
                                    </h3>
                                    {/* <TransactionList transactions={kMeans.clusters.tinggi.slice(0, 5)} total={kMeans.clusters.tinggi.length} /> */}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-3 gap-4">
                        {selectedIndikator.length > 0 && (
                            <Card className="col-span-full overflow-hidden rounded-xl border-0 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-800">Hasil Indikator Terpilih</h3>
                                                <p className="mt-1 text-sm text-gray-500">Dari hasil pola asosiasi FP-Growth</p>
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={submitIndikator}
                                                variant="outline"
                                                disabled={isSaved}
                                                className="border-primary text-primary hover:bg-primary/10"
                                            >
                                                {isSaved ? 'Indikator Berhasil Tersimpan' : 'Simpan Indikator'}
                                            </Button>
                                        </div>

                                        <div className="rounded-lg bg-gray-50 p-4">
                                            <ul className="space-y-3">
                                                {selectedIndikator.map((item, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-center justify-between rounded-md bg-white p-3 shadow-xs transition-all hover:shadow-sm"
                                                    >
                                                        <span className="font-medium text-gray-700">{item.name}</span>
                                                        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                            {item.count} rules
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        {kMeans.clusters && kMeans.clusters.rendah && (
                            <FPGrowthComponent
                                transactions={kMeans.clusters.rendah}
                                title="Rendah"
                                support_threshold={supportThreshold}
                                confidence_threshold={confidenceThreshold}
                                setConfidenceThreshold={setConfidenceThreshold}
                                setSupportThreshold={setSupportThreshold}
                                setAssociationResult={setAssociationRendah}
                            />
                        )}
                        {kMeans.clusters && kMeans.clusters.sedang && (
                            <FPGrowthComponent
                                transactions={kMeans.clusters.sedang}
                                title="Sedang"
                                support_threshold={supportThreshold}
                                confidence_threshold={confidenceThreshold}
                                setConfidenceThreshold={setConfidenceThreshold}
                                setSupportThreshold={setSupportThreshold}
                                setAssociationResult={setAssociationSedang}
                            />
                        )}
                        {kMeans.clusters && kMeans.clusters.tinggi && (
                            <FPGrowthComponent
                                transactions={kMeans.clusters.tinggi}
                                title="Tinggi"
                                support_threshold={supportThreshold}
                                confidence_threshold={confidenceThreshold}
                                setConfidenceThreshold={setConfidenceThreshold}
                                setSupportThreshold={setSupportThreshold}
                                setAssociationResult={setAssociationTinggi}
                            />
                        )}
                        {!kMeans.clusters && (
                            <h2 className="mb-4 text-2xl font-bold text-destructive">Peringatan : Data Hasil Panen Harus lebih dari 5</h2>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
const TransactionList: React.FC<{ transactions: string[][]; total: number }> = ({ transactions, total }) => (
    <ul>
        {transactions.map((transaction, idx) => (
            <li key={idx}>{transaction.join(', ')}</li>
        ))}
        {total > 5 && <li>...dan {total - 5} lainnya</li>}
    </ul>
);
