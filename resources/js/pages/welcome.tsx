import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";
import {
  Waves,
  TrendingUp,
  Search,
  BarChart3,
  Eye,
  Database,
  Calculator,
  FileText,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Github,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-teal-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Waves className="h-8 w-8 text-teal-600 mr-3" />
              <span className="text-xl font-bold text-gray-900">
                SeaHarvest Predict
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
              >
                Beranda
              </a>
             <Link
                  href={route('login')}
                  className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                >
                  Masuk
                </Link>
                <Link href={route('register')}>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white w-fit">
                  Daftar
                </Button>
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-teal-100"
            >
              <div className="flex flex-col space-y-4">
                <a
                  href="#"
                  className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                >
                  Beranda
                </a>
                <Link
                  href={route('login')}
                  className="text-gray-700 hover:text-teal-600 transition-colors font-medium"
                >
                  Masuk
                </Link>
                <Link href={route('register')}>
                <Button className="bg-teal-600 hover:bg-teal-700 text-white w-fit">
                  Daftar
                </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200">
                <Waves className="w-4 h-4 mr-2" />
                Analitik Kelautan Canggih
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Sistem Prediksi
              <span className="text-teal-600"> Panen Rumput Laut</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed"
            >
              Didukung oleh{" "}
              <span className="font-semibold text-teal-700">FP-Growth</span> &{" "}
              <span className="font-semibold text-blue-700">
                Multiple Linear Regression
              </span>{" "}
              Models
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto"
            >
              Manfaatkan kekuatan algoritma canggih untuk memprediksi hasil
              panen rumput laut dengan presisi, optimalkan operasi budidaya laut
              Anda, dan maksimalkan potensi panen.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
              >
                Mulai Prediksi
                <TrendingUp className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-teal-200 text-teal-700 hover:bg-teal-50 px-8 py-3"
              >
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
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none"
        >
          <Waves className="w-96 h-96 text-teal-600" />
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tentang Sistem
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sistem prediksi canggih kami menggabungkan kekuatan penambangan
              pola dan pemodelan statistik untuk memberikan prakiraan panen
              rumput laut yang akurat. Dibangun untuk petani laut, peneliti, dan
              profesional akuakultur yang menuntut presisi dan keandalan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-teal-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-teal-100 rounded-lg mr-4">
                    <Search className="h-8 w-8 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Algoritma FP-Growth
                    </h3>
                    <p className="text-teal-600">Penambangan Pola</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Menemukan pola yang sering muncul dalam data budidaya rumput
                  laut, mengidentifikasi faktor lingkungan kunci dan hubungannya
                  yang mempengaruhi hasil panen.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Calculator className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Multiple Linear Regression
                    </h3>
                    <p className="text-blue-600">Pemodelan Data</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Membuat model prediktif menggunakan beberapa variabel
                  lingkungan untuk meramalkan hasil rumput laut dengan akurasi
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
        className="py-20 bg-gradient-to-br from-gray-50 to-teal-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Fitur Utama
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alat komprehensif yang dirancang untuk merevolusi operasi budidaya
              rumput laut Anda
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-teal-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <TrendingUp className="h-8 w-8 text-teal-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Prediksi Hasil Cerdas
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Algoritma canggih memprediksi hasil panen dengan akurasi
                  tinggi menggunakan data lingkungan
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <Search className="h-8 w-8 text-blue-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Penemuan Pola
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Temukan pola tersembunyi dalam data budidaya rumput laut Anda
                  untuk mengoptimalkan operasi
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <Database className="h-8 w-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Input Ramah Pengguna
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Antarmuka intuitif untuk memasukkan data budidaya dengan
                  validasi dan panduan
                </p>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white hover:scale-105">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Analitik Visual
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Grafik interaktif dan dashboard untuk visualisasi data yang
                  komprehensif
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Prediction Insight Preview */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pratinjau Wawasan Prediksi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lihat bagaimana sistem kami mengubah data Anda menjadi wawasan
              yang dapat ditindaklanjuti
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
                    Grafik Prediksi Hasil Panen
                  </CardTitle>
                  <CardDescription>
                    Contoh data prediksi yang menunjukkan hasil yang diharapkan
                    vs aktual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <BarChart3 className="h-16 w-16 text-teal-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-500">
                        Pratinjau Grafik Interaktif
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Visualisasi prediksi real-time
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 shadow-lg bg-gradient-to-br from-teal-500 to-blue-600 text-white hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="text-white">Hasil Prediksi</CardTitle>
                  <CardDescription className="text-teal-100">
                    Siklus panen berikutnya
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      viewport={{ once: true }}
                      className="text-4xl font-bold mb-2"
                    >
                      2,847
                    </motion.div>
                    <div className="text-lg mb-4">kg</div>
                    <div className="flex items-center justify-center text-teal-100">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">+12% dari siklus terakhir</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-100">Kepercayaan</span>
                      <span>94%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-100">Kondisi Optimal</span>
                      <span>Ya</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Cara Kerja
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Langkah sederhana untuk mendapatkan prediksi panen rumput laut
              yang akurat
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  1
                </motion.div>
                <Database className="h-8 w-8 text-teal-400 absolute -top-2 -right-2" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Input Data Budidaya
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Masukkan variabel lingkungan seperti pH, salinitas, suhu, dan
                area tanam
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  2
                </motion.div>
                <Search className="h-8 w-8 text-blue-400 absolute -top-2 -right-2" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Analisis Pola
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Algoritma FP-Growth mengidentifikasi pola dan hubungan dalam
                data Anda
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  3
                </motion.div>
                <Calculator className="h-8 w-8 text-green-400 absolute -top-2 -right-2" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Prediksi Hasil
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Model regresi linier berganda menghasilkan prediksi panen yang
                akurat
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  4
                </motion.div>
                <FileText className="h-8 w-8 text-purple-400 absolute -top-2 -right-2" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Lihat & Ekspor
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Visualisasikan hasil dalam grafik interaktif dan ekspor laporan
                terperinci
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
        className="py-20 bg-white"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 shadow-lg border-teal-100 hover:shadow-xl transition-shadow">
              <div className="mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-16 h-16 bg-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <Waves className="h-8 w-8 text-teal-600" />
                </motion.div>
                <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-6">
                  &quot;Sistem prediksi ini telah merevolusi operasi budidaya
                  rumput laut kami. Akurasi prediksi hasil telah membantu kami
                  mengoptimalkan sumber daya dan meningkatkan produktivitas
                  sebesar 25%. Ini adalah alat yang sangat berharga untuk setiap
                  petani laut yang serius.&quot;
                </blockquote>
                <div className="flex items-center justify-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Dr. Maria Santos
                    </p>
                    <p className="text-gray-600">
                      Ahli Biologi Kelautan & Pemilik Budidaya Rumput Laut
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gray-900 text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-4 gap-8"
          >
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Waves className="h-8 w-8 text-teal-400 mr-3" />
                <span className="text-xl font-bold">SeaHarvest Predict</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Sistem prediksi panen rumput laut canggih yang didukung oleh
                algoritma pembelajaran mesin. Membantu petani laut
                mengoptimalkan operasi mereka di seluruh dunia.
              </p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-400 hover:text-white hover:border-teal-400"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-600 text-gray-400 hover:text-white hover:border-teal-400"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Dokumentasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Referensi API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Panduan Pengguna
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal-400 transition-colors">
                    Masuk
                  </a>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-lg font-semibold mb-4">Info Kontak</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-teal-400" />
                  <span className="text-sm">support@seaharvest.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-teal-400" />
                  <span className="text-sm">+62 (21) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-teal-400" />
                  <span className="text-sm">Pusat Penelitian Kelautan</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
          >
            <p>
              &copy; 2024 SeaHarvest Predict. Semua hak dilindungi. Dibangun
              dengan algoritma ML canggih.
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
