import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, Menu, Waves, X } from 'lucide-react';
import React, { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}
export default function MainLayout({ children }: AppLayoutProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
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
                className="fixed top-0 right-0 left-0 z-50 border-b border-teal-100 bg-white/90 backdrop-blur-md"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Waves className="mr-3 h-8 w-8 text-teal-600" />
                            <span className="text-xl font-bold text-gray-900">SeaHarvest Predict</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden items-center space-x-8 md:flex">

                            {auth.user ? (
                                <>
                                    <Link href="/" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        Beranda
                                    </Link>
                                    <Link href={route('user.dashboard')} className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('user.form.prediksi')}
                                        className="font-medium text-gray-700 transition-colors hover:text-teal-600"
                                    >
                                        Mulai Prediksi
                                    </Link>
                                    <Link href={route('user.riwayatPengguna.index')}>
                                        <Button variant="outline" size="lg" className="border-teal-200 px-8 py-3 text-teal-700 hover:bg-teal-50">
                                            Riwayat Prediksi
                                            <Eye className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <NavUser />
                                </>
                            ) : (
                                <>
                                <a href="#hero" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Beranda
                            </a>
                            <a href="#about" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Tentang Sistem
                            </a>
                            <a href="#features" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Fitur
                            </a>
                            <a href="#how-it-works" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Cara Kerja
                            </a>
                            <a href="#testimoni" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Jenis Rumput Laut
                            </a>
                                    <Link href={route('login')} className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        Masuk
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="w-fit bg-teal-600 text-white hover:bg-teal-700">Daftar</Button>
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-teal-100 py-4 md:hidden"
                        >
                            <div className="flex flex-col space-y-4">

                            {auth.user ? (
                                <>
                                    <Link href="/" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        Beranda
                                    </Link>
                                    <Link href={route('user.dashboard')} className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('user.form.prediksi')}
                                        className="font-medium text-gray-700 transition-colors hover:text-teal-600"
                                    >
                                        Mulai Prediksi
                                    </Link>
                                    <Link href={route('user.riwayatPengguna.index')}>
                                        <Button variant="outline" size="lg" className="border-teal-200 px-8 py-3 text-teal-700 hover:bg-teal-50">
                                            Riwayat Prediksi
                                            <Eye className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <NavUser />
                                </>
                            ) : (
                                <>
                                <a href="#hero" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Beranda
                            </a>
                            <a href="#about" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Tentang Sistem
                            </a>
                            <a href="#features" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Fitur
                            </a>
                            <a href="#how-it-works" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Cara Kerja
                            </a>
                            <a href="#testimoni" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Jenis Rumput Laut
                            </a>
                                    <Link href={route('login')} className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        Masuk
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button className="w-fit bg-teal-600 text-white hover:bg-teal-700">Daftar</Button>
                                    </Link>
                                </>
                            )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.nav>

            {/* content */}
            <main className="pt-16 pb-16">{children}</main>
            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gray-900 py-10 text-white"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid gap-8 md:grid-cols-4"
                    >
                        <motion.div variants={fadeInUp} className="md:col-span-2">
                            <div className="mb-4 flex items-center">
                                <Waves className="mr-3 h-8 w-8 text-teal-400" />
                                <span className="text-xl font-bold">SeaHarvest Predict</span>
                            </div>
                            <p className="mb-6 leading-relaxed text-gray-400">
                                Sistem prediksi panen rumput laut canggih yang didukung oleh algoritma pembelajaran mesin. Membantu petani laut
                                mengoptimalkan operasi mereka di seluruh dunia.
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400"
                    >
                        <p>&copy; 2024 SeaHarvest Predict. Semua hak dilindungi. Dibangun dengan algoritma ML .</p>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
}
