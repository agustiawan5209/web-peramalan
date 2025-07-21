import FormPrediction from '@/components/form-prediction';
import { Button } from '@/components/ui/button';
import { Card, CardDescription } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndikatorTypes } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
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
}

const opsiKejernihan = [
    { value: 5, label: 'Sangat Jernih' },
    { value: 4, label: 'Jernih' },
    { value: 3, label: 'Agak Keruh' },
    { value: 2, label: 'Keruh' },
    { value: 1, label: 'Sangat Keruh' },
];
const opsiCahaya = [
    { value: 5, label: 'Sangat Cerah' },
    { value: 4, label: 'Cerah' },
    { value: 3, label: 'Berawan' },
    { value: 2, label: 'Mendung' },
    { value: 1, label: 'Gelap' },
];
const opsiArus = [
    { value: 5, label: 'Sangat Kuat' },
    { value: 4, label: 'Kuat' },
    { value: 3, label: 'Sedang' },
    { value: 2, label: 'Lemah' },
    { value: 1, label: 'Sangat Lemah' },
];
const opsiNutrisi = [
    { value: 4, label: 'Melimpah' },
    { value: 3, label: 'Cukup' },
    { value: 2, label: 'Terbatas' },
    { value: 1, label: 'Sangat Sedikit' },
];

const MultipleLinearRegression: React.FC<MultipleLinearRegressionProps> = ({ breadcrumb, titlePage, transactionX, transactionY, indikator }: MultipleLinearRegressionProps) => {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );


    const [showTable, setShowTable] = useState<boolean>(false);
    const [data, setData] = useState<Transaction[]>(transactionX || []);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Paginate data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage || 'Regresi Linear Berganda'} />
            <div className="container mx-auto max-w-7xl px-6 py-3">
                <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-gray-900">Regresi Linear Berganda</h1>

                <section className="mb-10 rounded-xl bg-white p-6 shadow-md">
                    <Button type="button" variant={'default'} onClick={() => setShowTable(showTable ? false : true)}>
                        Tampilkan Data Panen
                    </Button>
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">Data Input</h2>
                    {(showTable || data.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="w-full overflow-auto"
                        >
                            <Table className="w-full border-separate border-spacing-y-2 text-left">
                                <TableHeader>
                                    <TableRow>
                                        {indikator &&
                                            indikator.map((item, index) => (
                                                <TableHead key={index} className="px-3 py-2 font-medium text-gray-600">
                                                    {item.nama}
                                                </TableHead>
                                            ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentItems.map((point: any, index) => (
                                        <TableRow key={index} className="bg-gray-50 transition hover:bg-gray-100">
                                            {indikator.map((item, key: number | string) => (
                                                <TableCell key={key} className="px-3 py-2">
                                                    {typeof point[item.id] === 'number' ? point[item.id].toFixed(0) : point[item.id]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="order-2 text-xs text-gray-500 sm:order-1 md:text-sm">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                                </div>
                                <Pagination className="order-1 sm:order-2">
                                    <PaginationContent className="flex-wrap justify-center">
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                size={undefined}
                                            />
                                        </PaginationItem>
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
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        isActive={page === currentPage}
                                                        onClick={() => setCurrentPage(page)}
                                                        size={undefined}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                size={undefined}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </motion.div>
                    )}
                </section>

                {data.length > 5 ? (
                    <FormPrediction transactionX={transactionX} transactionY={transactionY} indikator={indikator} />
                ) : (
                    <Card>
                        <CardDescription className='text-center'>
                            <p className="text-sm text-gray-600">Data panen harus lebih dari lima agar model dapat diuji. Silakan tambahkan data panen terlebih dahulu.</p>
                        </CardDescription>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
};

export default MultipleLinearRegression;
