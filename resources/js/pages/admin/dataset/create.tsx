import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndikatorTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

type JenisRumputLaut = {
    nama: string;
    jumlah: number;
};

type Dataset = {
    bulan: string;
    tahun: string;
    total_panen: number;
    jenisRumputLaut: JenisRumputLaut[];
    attribut: {
        kriteria_id: number;
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
    jenisTanaman: {
        nama: string;
    }[];
    titlePage?: string;
}
const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const opsiKejernihan = ['Sangat Jernih', 'Jernih', 'Agak Keruh', 'Keruh', 'Sangat Keruh'];
const opsiCahaya = ['Sangat Cerah', 'Cerah', 'Berawan', 'Mendung', 'Gelap'];
const opsiArus = ['Sangat Kuat', 'Kuat', 'Sedang', 'Lemah', 'Sangat Lemah'];
const opsiNutrisi = ['Melimpah', 'Cukup', 'Terbatas', 'Sangat Sedikit'];

export default function FormDatasetView({ breadcrumb, indikator, jenisTanaman, titlePage }: PropsDatasetView) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];
    const { data, setData, post, processing, errors } = useForm<Dataset>({
        bulan: '',
        tahun: new Date().getFullYear().toString(),
        total_panen: 0,
        jenisRumputLaut: [
            { nama: 'eucheuma_conttoni', jumlah: 0 },
            { nama: 'eucheuma_spinosum', jumlah: 0 },
        ],
        attribut: indikator.map((_, index) => ({
            kriteria_id: indikator[index].id,
            nilai: null,
        })),
    });

    console.log(data.attribut);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const key = name.split('.')[1];
        setData((prevData) => ({
            ...prevData,
            attribut: prevData.attribut.map((item, index) => {
                if (index === Number(key)) {
                    return {
                        ...item,
                        nilai: value,
                    };
                }
                return item;
            }),
        }));
    };
    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && data && data.attribut) {
            if (name === 'label' || name === 'jenis_tanaman') {
                setData((prevData) => ({
                    ...prevData,
                    [name]: value,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    attribut: prevData.attribut.map((item, index) => {
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
            console.error('Invalid data: name, value, or attribut may be undefined');
        }
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tambahkan logika submit di sini
        post(route('admin.dataset.store'), {
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
                    {/* Informasi Dasar */}
                    {/* Informasi Dasar */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label className="text-xs text-gray-600">Bulan</Label>
                            <Select value={data.bulan} required onValueChange={(value) => handleSelectChange('bulan', value)}>
                                <SelectTrigger className="input-minimal">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {daftarBulan.map((bulan) => (
                                        <SelectItem key={bulan} value={bulan}>
                                            {bulan}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.bulan && <InputError message={errors.bulan} className="mt-2" />}
                        </div>
                        <div>
                            <Label className="text-xs text-gray-600">Tahun</Label>
                            <Input type="number" name="tahun" value={data.tahun} onChange={handleChange} className="input-minimal" required />
                            {errors.tahun && <InputError message={errors.tahun} className="mt-2" />}
                        </div>
                        <div>
                            <Label className="text-xs text-gray-600">Total Panen (kg)</Label>
                            <Input
                                type="number"
                                name="total_panen"
                                value={data.total_panen}
                                onChange={handleChange}
                                className="input-minimal"
                                step="0.01"
                                required
                            />
                            {errors.total_panen && <InputError message={errors.total_panen} className="mt-2" />}
                        </div>
                    </div>

                    {/* Jenis Rumput Laut */}
                    <div>
                        <Label className="text-xs text-gray-600">Jenis Rumput Laut</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {data.jenisRumputLaut.map((jenis, index) => (
                                <div key={index} className="flex items-center gap-2 rounded bg-gray-50 p-2">
                                    <Input
                                        type="text"
                                        name={`jenisRumputLaut.${index}.nama`}
                                        value={jenis.nama}
                                        onChange={handleChange}
                                        className="input-minimal w-32"
                                        readOnly
                                        placeholder={`Jenis ${index + 1}`}
                                    />
                                    <Input
                                        type="number"
                                        name={`jenisRumputLaut.${index}.jumlah`}
                                        value={jenis.jumlah}
                                        onChange={handleChange}
                                        className="input-minimal flex-1"
                                        placeholder="kg"
                                        step="0.01"
                                    />
                                </div>
                            ))}
                            {errors.jenisRumputLaut && <InputError message={errors.jenisRumputLaut} className="mt-2" />}
                        </div>
                    </div>

                    {/* Parameter Lingkungan */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {indikator.map((item: { nama: string; id: number }, index: number) => {
                            if (item.nama.toLowerCase() === 'gejala') {
                                return (
                                    <div key={index}>
                                        <Label className="text-xs text-gray-600">{item.nama}</Label>
                                        <Select
                                            value={data.attribut[index].nilai || ''}
                                            required
                                            onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                        >
                                            <SelectTrigger className="input-minimal">
                                                <SelectValue placeholder="Pilih" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opsiGejala.map((gejala: any, index) => (
                                                    <SelectItem key={index} value={gejala.label}>
                                                        {gejala.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                );
                            }
                            return (
                                <div key={index}>
                                    <Label className="text-xs text-gray-600">{item.nama}</Label>
                                    <Input
                                        type="text"
                                        name={`attribut.${index}`}
                                        value={data.attribut[index].nilai || ''}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        placeholder={`masukkan ${item.nama}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
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
