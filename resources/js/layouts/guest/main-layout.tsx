import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Mail, MapPin, Menu, Phone, Waves, X } from 'lucide-react';
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
                className="static top-0 right-0 left-0 z-50 border-b border-teal-100 bg-white/90 backdrop-blur-md"
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Waves className="mr-3 h-8 w-8 text-teal-600" />
                            <span className="text-xl font-bold text-gray-900">SeaHarvest Predict</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden items-center space-x-8 md:flex">
                            <Link href="/" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                Beranda
                            </Link>
                            {auth.user ? (
                                <>
                                    <Link href={route('user.dashboard')} className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                        <Button className="w-fit bg-teal-600 text-white hover:bg-teal-700">Dashboard</Button>
                                    </Link>

                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        className="p-2.5 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring  focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                                    >
                                       Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
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
                                <a href="#" className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                    Beranda
                                </a>
                                <Link href={route('login')} className="font-medium text-gray-700 transition-colors hover:text-teal-600">
                                    Masuk
                                </Link>
                                <Link href={route('register')}>
                                    <Button className="w-fit bg-teal-600 text-white hover:bg-teal-700">Daftar</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.nav>

            {/* content */}
            <main className='py-10'>{children}</main>
            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gray-900 py-16 text-white"
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
                            <div className="flex space-x-4">
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-gray-600 text-gray-400 hover:border-teal-400 hover:text-white"
                                    >
                                        <Github className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }}>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-gray-600 text-gray-400 hover:border-teal-400 hover:text-white"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <h3 className="mb-4 text-lg font-semibold">Tautan Cepat</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>
                                    <a href="#" className="transition-colors hover:text-teal-400">
                                        Dokumentasi
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-teal-400">
                                        Referensi API
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-teal-400">
                                        Panduan Pengguna
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="transition-colors hover:text-teal-400">
                                        Masuk
                                    </a>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <h3 className="mb-4 text-lg font-semibold">Info Kontak</h3>
                            <div className="space-y-3 text-gray-400">
                                <div className="flex items-center">
                                    <Mail className="mr-2 h-4 w-4 text-teal-400" />
                                    <span className="text-sm">support@seaharvest.com</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-2 h-4 w-4 text-teal-400" />
                                    <span className="text-sm">+62 (21) 123-4567</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-teal-400" />
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
                        className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-400"
                    >
                        <p>&copy; 2024 SeaHarvest Predict. Semua hak dilindungi. Dibangun dengan algoritma ML canggih.</p>
                    </motion.div>
                </div>
            </motion.footer>
        </div>
    );
}
