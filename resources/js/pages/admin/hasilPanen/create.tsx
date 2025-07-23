import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndikatorTypes, SeaweedType } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import FormPanenView from './form';

type JenisRumputLaut = {
    nama: string;
    jumlah: number;
};

type Dataset = {
    bulan: string;
    tahun: string;
    kecamatan: string;
    desa: string;
    total_panen: string;
    jenisRumputLaut: JenisRumputLaut[];
    parameter: {
        indikator_id: number;
        nilai: string | null;
    }[];
};

const opsiGejala = [
    { label: 'daun menguning', value: 0 },
    { label: 'pertumbuhan lambat', value: 1 },
    { label: 'ujung daun mengering', value: 2 },
    { label: 'daun sehat', value: 3 },
    { label: 'batang rapuh', value: 4 },
    { label: 'daun menggulung', value: 5 },
];

interface PropsDatasetView {
    breadcrumb: BreadcrumbItem[];
    indikator: IndikatorTypes[];
    jenisRumputLaut: SeaweedType[];
    titlePage?: string;
}
const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const opsiKejernihan = ['Sangat Jernih', 'Jernih', 'Agak Keruh', 'Keruh', 'Sangat Keruh'];
const opsiCahaya = ['Sangat Cerah', 'Cerah', 'Berawan', 'Mendung', 'Gelap'];
const opsiArus = ['Sangat Kuat', 'Kuat', 'Sedang', 'Lemah', 'Sangat Lemah'];
const opsiNutrisi = ['Melimpah', 'Cukup', 'Terbatas', 'Sangat Sedikit'];

export default function FormDatasetView({ breadcrumb, indikator, jenisRumputLaut, titlePage }: PropsDatasetView) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];
    const { data, setData, post, processing, errors } = useForm<Dataset>({
        bulan: '',
        kecamatan: '',
        desa: '',
        tahun: new Date().getFullYear().toString(),
        total_panen: '',
        jenisRumputLaut: jenisRumputLaut,
        parameter: indikator.map((_, index) => ({
            indikator_id: indikator[index].id,
            nilai: null,
        })),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const key = name.split('.')[1];
        if (name.includes('jenisRumputLaut')) {
            const [_, index, field] = name.split('.');
            const updatedTypes = [...data.jenisRumputLaut];
            updatedTypes[parseInt(index)] = {
                ...updatedTypes[parseInt(index)],
                [field === 'jumlah' ? 'jumlah' : 'nama']: field === 'jumlah' ? parseFloat(value) : value,
            };
            setData({ ...data, jenisRumputLaut: updatedTypes });
        } else if (name.includes('parameter')) {
            setData((prevData) => ({
                ...prevData,
                parameter: prevData.parameter.map((item, index) => {
                    if (index === Number(key)) {
                        return {
                            ...item,
                            nilai: value,
                        };
                    }
                    return item;
                }),
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && data && data.parameter) {
            if (name === 'label' || name === 'jenis_tanaman' || name == 'bulan') {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    parameter: prevData.parameter.map((item, index) => {
                        if (index === Number(name)) {
                            return {
                                ...item,
                                nilai: value,
                            };
                        } else {
                            return item;
                        }
                    }),
                }));
            }
        } else {
            console.error('Invalid data: name, value, or parameter may be undefined');
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tambahkan logika submit di sini
        post(route('admin.hasilPanen.store'), {
            onError: (err) => {
                console.log(err);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Input Data Panen Rumput Laut'} />
            <div className="mx-auto max-w-7xl rounded-xl border border-gray-100 bg-white p-6 shadow">
                <h1 className="mb-6 text-center text-xl font-semibold text-primary">Input Data Panen Rumput Laut</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormPanenView
                        data={data}
                        errors={errors}
                        indikator={indikator}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" variant={'default'}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Simpan Data
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
