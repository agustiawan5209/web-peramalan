import FormPrediction from '@/components/form-prediction';
import { Button } from '@/components/ui/button';
import { Card, CardDescription } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import MainLayout from '@/layouts/guest/main-layout';
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


const MultipleLinearRegression: React.FC<MultipleLinearRegressionProps> = ({
    breadcrumb,
    titlePage,
}: MultipleLinearRegressionProps) => {
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
                setData(response.data.transactionX)
                setIndikator(response.data.indikator)
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
        setDataTransaction({changeIndikator: value})
    };
    return (
        <MainLayout >
            <Head title={titlePage || 'Regresi Linear Berganda'} />
            <div className="container mx-auto max-w-7xl px-6 py-3">
                <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-gray-900">Regresi Linear Berganda</h1>


                {indikator.length > 0 && !isLoadingModel ? (
                    <FormPrediction transactionX={multipleRegressionData.transactionX} transactionY={multipleRegressionData.transactionY} indikator={multipleRegressionData.indikator} showTrain={false} />
                ) : (
                    <Card>
                        <CardDescription className="text-center">
                            <p className="text-sm text-gray-600">
                                Data panen harus lebih dari lima agar model dapat diuji. Silakan tambahkan data panen terlebih dahulu.
                            </p>
                        </CardDescription>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
};

export default MultipleLinearRegression;
