import FormPrediction from '@/components/form-prediction';
import InformationModelStep from '@/components/information-model';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndikatorTypes, MultipleLinearRegressionModelTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
interface Transaction {
    panjangGarisPantai: number;
    jumlahPetani: number;
    luasPotensi: number;
    luasTanam: number;
    jumlahTali: number;
    jumlahBibit: number;
    suhuAir: number;
    salinitas: number;
    kejernihanAir: string;
    cahayaMatahari: string;
    arusAir: string;
    kedalamanAir: number;
    pHAir: number;
    ketersediaanNutrisi: string;
    eucheuma_conttoni: number;
    eucheuma_spinosum: number;
}
interface MultipleLinearRegressionProps {
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    transactionX: Transaction[];
    transactionY: {
        eucheuma_conttoni_basah: number;
        eucheuma_conttoni_kering: number;
        eucheuma_spinosum_basah: number;
        eucheuma_spinosum_kering: number;
    }[];
    indikator: IndikatorTypes[];
    indikatorset: boolean;
}

const MultipleLinearRegression: React.FC<MultipleLinearRegressionProps> = ({ breadcrumb, titlePage }: MultipleLinearRegressionProps) => {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );
    const {
        data: requestForm,
        setData: setRequestForm,
        get,
        processing,
        errors,
    } = useForm<{ indikator: boolean }>({
        indikator: false,
    });
    const [data, setData] = useState<Transaction[]>([]);

    const [indikator, setIndikator] = useState<IndikatorTypes[]>([]);

    const [isLoadingModel, setIsLoadingModel] = useState<boolean>(true);
    const [errorModel, setErrorModel] = useState<{ text: string; status: boolean }>({ text: '', status: false });
    const [multipleRegressionData, setMultipleRegressionData] = useState<MultipleLinearRegressionModelTypes>({
        transactionX: [],
        transactionY: [
            {
                eucheuma_conttoni_basah: 0,
                eucheuma_conttoni_kering: 0,
                eucheuma_spinosum_basah: 0,
                eucheuma_spinosum_kering: 0,
            },
        ],
        indikator: [
            {
                id: 0,
                nama: '',
                keterangan: '',
                attribut: [
                    {
                        batas: 0,
                        operator: '',
                        nilai: '',
                    },
                ],
            },
        ],
    });

    const setDataTransaction = async ({ changeIndikator }: { changeIndikator?: boolean | null }) => {
        try {
            setIsLoadingModel(true);
            const response: {
                status: number;
                data: MultipleLinearRegressionModelTypes;
            } = await axios.get(route('prediction.setTransactionAPI', { indikator: changeIndikator }));
            if (response.status == 200) {
                setMultipleRegressionData({
                    transactionX: response.data.transactionX,
                    transactionY: response.data.transactionY,
                    indikator: response.data.indikator,
                });
                setData(response.data.transactionX);
                setIndikator(response.data.indikator);
            }
            console.log(response.data);
        } catch (error) {
            console.log(error);

            setErrorModel({
                status: true,
                text: 'Terjadi Kesalahan Ketika Memuat Data Transaksi, Coba Ulangi sekali lagi dengan merefresh Halaman',
            });
        } finally {
            setIsLoadingModel(false);
        }
    };

    useEffect(() => {
        setDataTransaction({ changeIndikator: null });
    }, [titlePage]);
    // Tampilkan data dalam bentuk state
    const [showTable, setShowTable] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const changeIndikator = (value: boolean) => {
        setDataTransaction({ changeIndikator: value });
    };

    const [openDialogInformation, setOpenDialogInformation] = useState<boolean>(false);
    const showInformation = () => {
        setOpenDialogInformation(true);
    };
    const clostInformation = () => {
        setOpenDialogInformation(false);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage || 'Regresi Linear Berganda'} />

            <div className="container mx-auto max-w-7xl px-4 py-6">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Regresi Linear Berganda</h1>
                    <p className="text-gray-500">Analisis prediksi menggunakan metode regresi linear berganda</p>
                </div>

                {/* Indicator Selection Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div
                        className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                        onClick={() => changeIndikator(false)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-900">Gunakan Semua Indikator</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Analisis menggunakan seluruh indikator yang tersedia</p>
                    </div>

                    <div
                        className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                        onClick={() => changeIndikator(true)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-900">Gunakan Indikator Terpilih</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Analisis hanya pada indikator yang dipilih</p>
                    </div>

                    <div className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md" onClick={showInformation}>
                        <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="font-medium text-gray-900">Informasi Tata Cara Prediksi Model</h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Pelajari lebih lanjut tentang metode ini</p>
                    </div>
                </div>

                {/* Data Section */}
                <section className="mb-10 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Data Input</h2>
                            <p className="text-sm text-gray-500">Data yang digunakan untuk analisis regresi</p>
                        </div>
                        <button
                            onClick={() => setShowTable(!showTable)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            {showTable ? 'Sembunyikan' : 'Tampilkan'} Data Panen
                            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={showTable ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                                />
                            </svg>
                        </button>
                    </div>

                    {data.length > 0 && showTable && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="mt-6 overflow-hidden rounded-lg border border-gray-200"
                        >
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {indikator.map((item, index) => (
                                                <th
                                                    key={index}
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                                                >
                                                    {item.nama}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {currentItems.map((point :any, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                {indikator.map((item, key) => (
                                                    <td key={key} className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                        {typeof point[key] === 'number' ? point[key].toFixed(0) : point[key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-center justify-between border-t border-gray-200 bg-white px-6 py-4 sm:flex-row">
                                <div className="text-sm text-gray-500">
                                    Menampilkan <span className="font-medium">{indexOfFirstItem + 1}</span> sampai{' '}
                                    <span className="font-medium">{Math.min(indexOfLastItem, data.length)}</span> dari{' '}
                                    <span className="font-medium">{data.length}</span> data
                                </div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                            currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                    >
                                        <span className="sr-only">Previous</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let page;
                                        if (totalPages <= 5) {
                                            page = i + 1;
                                        } else if (currentPage <= 3) {
                                            page = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            page = totalPages - 4 + i;
                                        } else {
                                            page = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                aria-current={page === currentPage ? 'page' : undefined}
                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                    page === currentPage
                                                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                        : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                                            currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                                        }`}
                                    >
                                        <span className="sr-only">Next</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l4.5 4.25a.75.75 0 11-1.06 1.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </motion.div>
                    )}
                </section>

                {/* Result Section */}
                {data.length > 5 && indikator.length > 0 && !isLoadingModel ? (
                    <FormPrediction
                        transactionX={multipleRegressionData.transactionX}
                        transactionY={multipleRegressionData.transactionY}
                        indikator={multipleRegressionData.indikator}
                        showTrain={true}
                    />
                ) : (
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Data tidak cukup</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Data panen harus lebih dari lima agar model dapat diuji. Silakan tambahkan data panen terlebih dahulu.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={openDialogInformation} onOpenChange={setOpenDialogInformation} >
                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>Informasi Halaman</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className='sm:max-w-7xl'>
                        <InformationModelStep />
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="destructive" onClick={clostInformation} disabled={processing}>
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default MultipleLinearRegression;
