import { motion } from 'framer-motion';
import { useState } from 'react';

const InformationModelStep = () => {
    const [activeTab, setActiveTab] = useState<'training' | 'prediction'>('training');

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mx-auto h-screen max-w-7xl rounded-lg bg-white p-6 shadow-md overflow-y-auto">
            <h1 className="mb-6 text-3xl font-bold text-green-700">Sistem Prediksi Panen Pertanian</h1>

            <p className="mb-6 text-gray-600">
                Sistem ini menggunakan tiga pendekatan analitik data:
                <span className="font-semibold"> Regresi Linear Berganda</span> untuk prediksi hasil panen,
                <span className="font-semibold"> Kluster K-Means</span> untuk pemilihan indikator, dan
                <span className="font-semibold"> FP-Growth</span> untuk menemukan pola asosiasi antara faktor-faktor produksi.
            </p>

            <div className="mb-6 flex border-b">
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'training' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('training')}
                >
                    Pelatihan Model
                </button>
                <button
                    className={`px-4 py-2 font-medium ${activeTab === 'prediction' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('prediction')}
                >
                    Prediksi Hasil Panen
                </button>
            </div>

            {activeTab === 'training' ? (
                <motion.div variants={fadeIn}>
                    <h2 className="mb-4 text-2xl font-semibold text-green-600">Tata Cara Pelatihan Model</h2>

                    <div className="space-y-6">


                        <StepCard
                            step={1}
                            title="Pola Asosiasi"
                            content={
                                <div className="space-y-2">
                                    <p>Masuk Ke Halaman Pola Asosiasi Lalu pilih Threshold dan Support untuk menampilkan hasil aturan pola asosiasi</p>

                                </div>
                            }
                        />
                        <StepCard
                            step={2}
                            title="Klastering dengan K-Means"
                            content={
                                <div className="space-y-2">
                                    <p>algoritma K-Means digunakan untuk mengelompokkan hasil panen sesuai dengan klusternya masing-masing</p>
                                    <p>dengan menggunakan centroid dari interpresentasi dari data panen</p>
                                </div>
                            }
                        />

                        <StepCard
                            step={3}
                            title="Pola Asosiasi dengan FP-Growth"
                            content={
                                <div className="space-y-2">
                                    <p>menampilkan hubungan antara indikator dengan aturan hasil dari FP-GROWTH</p>
                                </div>
                            }
                        />

                        <StepCard
                            step={4}
                            title="Pelatihan Model Regresi Linear Berganda"
                            content={
                                <div className="space-y-2">
                                    <p>Buat model prediksi hasil panen:</p>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>Pilih variabel independen berdasarkan hasil K-Means dan FP-Growth</li>
                                        <li>Pilih Pada Halaman untuk menggunakan semua indikator</li>
                                        <li>Atau Hanya menggunakan indikator yang sudah ditemukan</li>
                                        <li>Latih model dengan data training</li>
                                    </ul>
                                </div>
                            }
                        />
                    </div>
                </motion.div>
            ) : (
                <motion.div variants={fadeIn}>
                    <h2 className="mb-4 text-2xl font-semibold text-green-600">Tata Cara Prediksi Hasil Panen</h2>

                    <div className="space-y-6">
                        <StepCard
                            step={1}
                            title="Persiapan Data Input"
                            content={
                                <ul className="list-disc space-y-1 pl-5">
                                    <li>Siapkan data input sesuai dengan format model</li>
                                    <li>Pastikan semua variabel yang diperlukan tersedia</li>
                                    <li>Lakukan preprocessing yang sama seperti saat training</li>
                                </ul>
                            }
                        />

                        <StepCard
                            step={2}
                            title="Lakukan Prediksi"
                            content={
                                <div className="space-y-2">
                                    <p>Gunakan model regresi linear berganda:</p>
                                    <ul className="list-disc space-y-1 pl-5">
                                        <li>Masukkan data yang sudah diproses ke model</li>
                                        <li>Dapatkan prediksi hasil panen</li>
                                        <li>Estimasi interval kepercayaan prediksi</li>
                                    </ul>
                                </div>
                            }
                        />

                    </div>
                </motion.div>
            )}

            <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
                <h3 className="mb-2 font-semibold text-green-700">Catatan Penting:</h3>
                <ul className="list-disc space-y-1 pl-5 text-green-800">
                    <li>Pastikan setelah mengganti indikator, lakukan pelatihan model</li>
                    <li>Update model secara berkala dengan data baru</li>
                    <li>Ulangi Proses Pelatihan Apabila Terjadi Kesalahan Inpresetasi</li>
                </ul>
            </div>
        </motion.div>
    );
};

interface StepCardProps {
    step: number;
    title: string;
    content: React.ReactNode;
}

const StepCard = ({ step, title, content }: StepCardProps) => {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start">
                <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <span className="font-bold text-green-700">{step}</span>
                </div>
                <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
                    <div className="text-gray-600">{content}</div>
                </div>
            </div>
        </motion.div>
    );
};

export default InformationModelStep;
