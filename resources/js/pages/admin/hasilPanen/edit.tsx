import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, HasilPanenTypes, IndikatorTypes, ParameterHasilPanenTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type JenisRumputLaut = {
    nama: string;
    jumlah: number;
};

type DataPanen = {
    bulan: string;
    tahun: string;
    total_panen: number;
    jenisRumputLaut: JenisRumputLaut[];
    parameter: {
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
        phAir: number;
        ketersediaanNutrisi: string;
    };
};

const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const opsiKejernihan = ['Sangat Jernih', 'Jernih', 'Agak Keruh', 'Keruh', 'Sangat Keruh'];
const opsiCahaya = ['Sangat Cerah', 'Cerah', 'Berawan', 'Mendung', 'Gelap'];
const opsiArus = ['Sangat Kuat', 'Kuat', 'Sedang', 'Lemah', 'Sangat Lemah'];
const opsiNutrisi = ['Melimpah', 'Cukup', 'Terbatas', 'Sangat Sedikit'];

interface PropsPanenRumputLaut {
    hasilPanen: HasilPanenTypes;
    breadcrumb: BreadcrumbItem[];
    indikator: IndikatorTypes[];
    titlePage?: string;
}

export default function EditPanenRumputLaut({ hasilPanen, breadcrumb, indikator, titlePage }: PropsPanenRumputLaut) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    const jenisRumputLaut: Array<{ nama: string; jumlah: number }> = JSON.parse(hasilPanen.jenisRumputLaut);
    const parameter: ParameterHasilPanenTypes = JSON.parse(hasilPanen.parameter);
    const { data, setData, put, processing, errors } = useForm<DataPanen>({
        bulan: hasilPanen.bulan,
        tahun: hasilPanen.tahun,
        total_panen: hasilPanen.total_panen,
        jenisRumputLaut: jenisRumputLaut,
        parameter: parameter,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('jenisRumputLaut')) {
            const [_, index, field] = name.split('.');
            const updatedTypes = [...data.jenisRumputLaut];
            updatedTypes[parseInt(index)] = {
                ...updatedTypes[parseInt(index)],
                [field === 'jumlah' ? 'jumlah' : 'nama']: field === 'jumlah' ? parseFloat(value) : value,
            };
            setData({ ...data, jenisRumputLaut: updatedTypes });
        } else if (name.startsWith('parameter.')) {
            const field = name.split('.')[1];
            setData({
                ...data,
                parameter: {
                    ...data.parameter,
                    [field]:
                        field === 'kejernihanAir' || field === 'cahayaMatahari' || field === 'arusAir' || field === 'ketersediaanNutrisi'
                            ? value
                            : parseFloat(value),
                },
            });
        } else {
            setData({
                ...data,
                [name]: value.toString(),
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tambahkan logika submit di sini
        put(route('admin.hasilPanen.update', {hasilPanen: hasilPanen.id}), {
            onError: (err) => {
                console.log(err);
            },
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && data && data.parameter) {
            if (name === 'bulan') {
                setData((prevData) => ({
                    ...prevData,
                    bulan: value,
                }));
            } else {
                setData((prevData) => ({
                    ...prevData,
                    parameter: {
                        ...prevData.parameter,
                        [name]: value,
                    },
                }));
            }
        } else {
            console.error('Invalid data: name, value, or parameter may be undefined');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Edit Data Panen Rumput Laut'} />
            <div className="mx-auto max-w-7xl rounded-xl border border-gray-100 bg-white p-6 shadow">
                <h1 className="mb-6 text-center text-xl font-semibold text-primary">Edit Data Panen Rumput Laut</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <div className="space-y-2">
                            <div>
                                <Label className="text-xs text-gray-600">Panjang Garis Pantai (km)</Label>
                                <Input
                                    type="number"
                                    name="parameter.panjangGarisPantai"
                                    value={data.parameter.panjangGarisPantai}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Jumlah Petani</Label>
                                <Input
                                    type="number"
                                    name="parameter.jumlahPetani"
                                    value={data.parameter.jumlahPetani}
                                    onChange={handleChange}
                                    className="input-minimal"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Luas Potensi (Ha)</Label>
                                <Input
                                    type="number"
                                    name="parameter.luasPotensi"
                                    value={data.parameter.luasPotensi}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Luas Tanam (Ha)</Label>
                                <Input
                                    type="number"
                                    name="parameter.luasTanam"
                                    value={data.parameter.luasTanam}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Jumlah Tali</Label>
                                <Input
                                    type="number"
                                    name="parameter.jumlahTali"
                                    value={data.parameter.jumlahTali}
                                    onChange={handleChange}
                                    className="input-minimal"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Bibit (kg)</Label>
                                <Input
                                    type="number"
                                    name="parameter.jumlahBibit"
                                    value={data.parameter.jumlahBibit}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <Label className="text-xs text-gray-600">Suhu Air (°C)</Label>
                                <Input
                                    type="number"
                                    name="parameter.suhuAir"
                                    value={data.parameter.suhuAir}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Salinitas (ppt)</Label>
                                <Input
                                    type="number"
                                    name="parameter.salinitas"
                                    value={data.parameter.salinitas}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Kejernihan Air</Label>
                                <Select value={data.parameter.kejernihanAir} onValueChange={(value) => handleSelectChange('kejernihanAir', value)}>
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opsiKejernihan.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Cahaya Matahari</Label>
                                <Select value={data.parameter.cahayaMatahari} onValueChange={(value) => handleSelectChange('cahayaMatahari', value)}>
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opsiCahaya.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Arus Air</Label>
                                <Select value={data.parameter.arusAir} onValueChange={(value) => handleSelectChange('arusAir', value)}>
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opsiArus.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Kedalaman Air (m)</Label>
                                <Input
                                    type="number"
                                    name="parameter.kedalamanAir"
                                    value={data.parameter.kedalamanAir}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">pH Air</Label>
                                <Input
                                    type="number"
                                    name="parameter.phAir"
                                    value={data.parameter.phAir}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Ketersediaan Nutrisi</Label>
                                <Select
                                    value={data.parameter.ketersediaanNutrisi}
                                    onValueChange={(value) => handleSelectChange('ketersediaanNutrisi', value)}
                                >
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {opsiNutrisi.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="hover:bg-primary-dark rounded bg-primary px-6 py-2 font-medium text-white transition">
                            Simpan Data
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                .input-minimal {
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 8px 12px;
                    font-size: 14px;
                    outline: none;
                    transition: border 0.2s;
                }
                .input-minimal:focus {
                    border-color: var(--color-primary, #2563eb);
                    background: #fff;
                }
                .bg-primary { background-color: var(--color-primary, #2563eb); }
                .bg-primary-dark { background-color: var(--color-primary-dark, #1d4ed8); }
                .text-primary { color: var(--color-primary, #2563eb); }
            `}</style>
        </AppLayout>
    );
}
