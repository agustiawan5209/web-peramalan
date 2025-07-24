import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/guest/main-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart3, Calculator, Database, Eye, FileText, Search, TrendingUp, Waves } from 'lucide-react';
import React from 'react';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <MainLayout>
            <Head title="Home" />
            {/* Hero Section */}
            <section id='hero' className="relative overflow-hidden pt-16">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10" />
                <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
                    <motion.div className="mx-auto max-w-4xl" variants={staggerContainer} initial="initial" animate="animate">
                        <motion.div variants={fadeInUp}>
                            <Badge className="mb-6 border-teal-200 bg-teal-100 text-teal-800 hover:bg-teal-200">
                                <Waves className="mr-2 h-4 w-4" />
                                Analitik Kelautan Canggih
                            </Badge>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
                            Sistem Prediksi
                            <span className="text-teal-600"> Panen Rumput Laut</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl">
                            Didukung oleh <span className="font-semibold text-teal-700">FP-Growth</span> &{' '}
                            <span className="font-semibold text-blue-700">Multiple Linear Regression</span> Models
                        </motion.p>
                        <motion.p variants={fadeInUp} className="mx-auto mb-10 max-w-2xl text-lg text-gray-500">
                            Manfaatkan kekuatan algoritma canggih untuk memprediksi hasil panen rumput laut dengan presisi, optimalkan operasi
                            budidaya laut Anda, dan maksimalkan potensi panen.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link href={route('user.form.prediksi')}>
                                <Button size="lg" className="bg-teal-600 px-8 py-3 text-white hover:bg-teal-700">
                                    Mulai Prediksi
                                    <TrendingUp className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="border-teal-200 px-8 py-3 text-teal-700 hover:bg-teal-50">
                                Lihat Demo
                                <Eye className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating illustration */}
                <motion.div
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-5"
                >
                    <Waves className="h-96 w-96 text-teal-600" />
                </motion.div>
            </section>

            {/* About Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white py-20"
                id='about'
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Tentang Sistem</h2>
                        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
                            Sistem prediksi canggih kami menggabungkan kekuatan penambangan pola dan pemodelan statistik untuk memberikan prakiraan
                            panen rumput laut yang akurat. Dibangun untuk petani laut, peneliti, dan profesional akuakultur yang menuntut presisi dan
                            keandalan.
                        </p>
                    </motion.div>

                    <div className="grid items-center gap-12 md:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <Card className="border-teal-100 p-8 shadow-lg transition-shadow hover:shadow-xl">
                                <div className="mb-6 flex items-center">
                                    <div className="mr-4 rounded-lg bg-teal-100 p-3">
                                        <Search className="h-8 w-8 text-teal-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Algoritma FP-Growth</h3>
                                        <p className="text-teal-600">Penambangan Pola</p>
                                    </div>
                                </div>
                                <p className="leading-relaxed text-gray-600">
                                    Menemukan pola yang sering muncul dalam data budidaya rumput laut, mengidentifikasi faktor lingkungan kunci dan
                                    hubungannya yang mempengaruhi hasil panen.
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <Card className="border-blue-100 p-8 shadow-lg transition-shadow hover:shadow-xl">
                                <div className="mb-6 flex items-center">
                                    <div className="mr-4 rounded-lg bg-blue-100 p-3">
                                        <Calculator className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">Multiple Linear Regression</h3>
                                        <p className="text-blue-600">Pemodelan Data</p>
                                    </div>
                                </div>
                                <p className="leading-relaxed text-gray-600">
                                    Membuat model prediktif menggunakan beberapa variabel lingkungan untuk meramalkan hasil rumput laut dengan akurasi
                                    tinggi dan kepercayaan statistik.
                                </p>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-teal-50 py-20"
                id='features'
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Fitur Utama</h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Alat komprehensif yang dirancang untuk merevolusi operasi budidaya rumput laut Anda
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <motion.div variants={fadeInUp}>
                            <Card className="border-0 bg-white p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 p-4"
                                >
                                    <TrendingUp className="h-8 w-8 text-teal-600" />
                                </motion.div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Prediksi Hasil Cerdas</h3>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    Algoritma canggih memprediksi hasil panen dengan akurasi tinggi menggunakan data lingkungan
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Card className="border-0 bg-white p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 p-4"
                                >
                                    <Search className="h-8 w-8 text-blue-600" />
                                </motion.div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Penemuan Pola</h3>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    Temukan pola tersembunyi dalam data budidaya rumput laut Anda untuk mengoptimalkan operasi
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Card className="border-0 bg-white p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 p-4"
                                >
                                    <Database className="h-8 w-8 text-green-600" />
                                </motion.div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Input Ramah Pengguna</h3>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    Antarmuka intuitif untuk memasukkan data budidaya dengan validasi dan panduan
                                </p>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Card className="border-0 bg-white p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 p-4"
                                >
                                    <BarChart3 className="h-8 w-8 text-purple-600" />
                                </motion.div>
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Analitik Visual</h3>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    Grafik interaktif dan dashboard untuk visualisasi data yang komprehensif
                                </p>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* How It Works */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 py-20"
                id='how-it-works'
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Cara Kerja</h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Langkah sederhana untuk mendapatkan prediksi panen rumput laut yang akurat
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-2xl font-bold text-white"
                                >
                                    1
                                </motion.div>
                                <Database className="absolute -top-2 -right-2 h-8 w-8 text-teal-400" />
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Input Data Budidaya</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Masukkan variabel lingkungan seperti pH, salinitas, suhu, dan area tanam
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white"
                                >
                                    2
                                </motion.div>
                                <Search className="absolute -top-2 -right-2 h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Analisis Pola</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Algoritma FP-Growth mengidentifikasi pola dan hubungan dalam data Anda
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white"
                                >
                                    3
                                </motion.div>
                                <Calculator className="absolute -top-2 -right-2 h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Prediksi Hasil</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Model regresi linier berganda menghasilkan prediksi panen yang akurat
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="text-center">
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-2xl font-bold text-white"
                                >
                                    4
                                </motion.div>
                                <FileText className="absolute -top-2 -right-2 h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-gray-900">Lihat & Ekspor</h3>
                            <p className="text-sm leading-relaxed text-gray-600">
                                Visualisasikan hasil dalam grafik interaktif dan ekspor laporan terperinci
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Testimonial */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white py-20"
                id='testimoni'
            >
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className='grid grid-cols-1 md:grid-cols-3 gap-4'
                    >
                        <Card className="border-teal-100 p-8 shadow-lg transition-shadow hover:shadow-xl">
                            <CardTitle>Jenis Rumput Laut: Eucheuma cottonii dan Eucheuma spinosum</CardTitle>
                            <div className="mb-6">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100"
                                >
                                    <Waves className="h-8 w-8 text-teal-600" />
                                </motion.div>
                                <blockquote className="mb-6 text-sm leading-relaxed text-gray-700 italic md:text-base">
                                    Eucheuma cottonii dan Eucheuma spinosum adalah dua jenis rumput laut merah yang sangat penting dalam industri
                                    alginat dan karagenan, terutama di Indonesia. Keduanya memiliki peran besar sebagai sumber bahan baku karagenan,
                                    sebuah hidrokoloid yang banyak digunakan dalam makanan, kosmetik, dan farmasi karena sifatnya sebagai pengental
                                    dan penstabil.
                                </blockquote>
                            </div>
                        </Card>

                        <Card className="border-teal-100 p-8 shadow-lg transition-shadow hover:shadow-xl">
                            <CardTitle>Eucheuma cottonii</CardTitle>
                            <div className="mb-6">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100"
                                >
                                    <Waves className="h-8 w-8 text-teal-600" />
                                </motion.div>
                                <blockquote className="mb-6 text-sm leading-relaxed text-gray-700 italic md:text-base">
                                    **Eucheuma cottonii** dikenal juga dengan nama ilmiah *Kappaphycus alvarezii*. Rumput laut ini adalah penghasil
                                    utama **kappa karagenan**. Kappa karagenan dikenal karena kemampuannya membentuk gel yang kuat dan kaku, yang
                                    sangat ideal untuk produk seperti jeli, puding, dan pengental dalam produk susu. Tekstur *E. cottonii* cenderung
                                    lebih kasar dan cabangnya lebih besar dibandingkan *E. spinosum*.
                                </blockquote>
                            </div>
                        </Card>

                        <Card className="border-teal-100 p-8 shadow-lg transition-shadow hover:shadow-xl">
                            <CardTitle>Eucheuma spinosum</CardTitle>
                            <div className="mb-6">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100"
                                >
                                    <Waves className="h-8 w-8 text-teal-600" />
                                </motion.div>
                                <blockquote className="mb-6 text-sm leading-relaxed text-gray-700 italic md:text-base">
                                    **Eucheuma spinosum** atau nama lainnya *Eucheuma denticulatum* adalah penghasil utama **iota karagenan**. Iota
                                    karagenan menghasilkan gel yang lebih elastis, lembut, dan stabil terhadap pembekuan dan pencairan, sehingga cocok
                                    untuk produk-produk seperti es krim, saus salad, dan daging olahan. Morfologi *E. spinosum* umumnya lebih halus
                                    dan memiliki cabang yang lebih ramping.
                                </blockquote>
                            </div>
                        </Card>

                        <Card className="col-span-3 border-teal-100 p-8 shadow-lg transition-shadow hover:shadow-xl">
                            <CardTitle>Perbedaan Rumput Laut Basah dan Kering</CardTitle>
                            <div className="mb-6">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100"
                                >
                                    <Waves className="h-8 w-8 text-teal-600" />
                                </motion.div>
                                <blockquote className="mb-6 text-sm leading-relaxed text-gray-700 italic md:text-base">
                                    Perbedaan utama antara rumput laut basah dan kering terletak pada **kadar air dan tujuan penggunaannya**.
                                </blockquote>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Rumput Laut Basah</h3>
                                <blockquote className="mb-6 text-sm leading-relaxed text-gray-700 italic md:text-base">
                                    **Rumput laut basah** adalah rumput laut yang baru dipanen dan masih mengandung kadar air yang tinggi, biasanya
                                    mencapai 80-90%. Kondisi ini membuatnya sangat rentan terhadap pembusukan jika tidak segera diolah. Rumput laut
                                    basah biasanya digunakan untuk konsumsi langsung sebagai sayuran, salad, atau hidangan segar lainnya. Beberapa
                                    pembudidaya juga menjualnya dalam keadaan basah untuk pengolahan awal di tempat lain.
                                </blockquote>
                                <h3 className="mb-3 text-lg font-semibold text-gray-800">Rumput Laut Kering</h3>
                                <blockquote className="mb-6 text-sm leading-relaxed text-gray-700 italic md:text-base">
                                    **Rumput laut kering** adalah hasil dari proses pengeringan rumput laut basah, baik dengan sinar matahari langsung
                                    maupun pengeringan buatan. Tujuan utama pengeringan adalah mengurangi kadar air hingga sekitar 10-15%, yang secara
                                    signifikan memperpanjang masa simpannya dan mengurangi bobotnya untuk memudahkan transportasi. Rumput laut kering
                                    inilah yang menjadi bahan baku utama bagi industri pengolahan karagenan, agar-agar, atau alginat. Setelah
                                    dikeringkan, rumput laut ini bisa diolah lebih lanjut menjadi tepung atau ekstrak. Proses pengeringan juga
                                    membantu mengkonsentrasikan kandungan karagenan di dalamnya, membuatnya lebih efisien untuk ekstraksi.
                                </blockquote>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.section>
        </MainLayout>
    );
};

export default Home;
