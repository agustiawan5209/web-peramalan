import InputError from '@/components/input-error';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem, IndikatorTypes, SeaweedType } from '@/types';

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

export default function FormPanenView({
    data,
    errors,
    handleChange,
    handleSelectChange,
    indikator,
}: {
    data: any;
    errors: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSelectChange: (name: string, value: string) => void;
    indikator: IndikatorTypes[];
}) {
    return (
        <>
            {/* Informasi Dasar */}
            {/* Informasi Dasar */}

            {/* Jenis Rumput Laut */}
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle> Input Data Daerah</CardTitle>
                    </CardHeader>
                    <CardDescription>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
                            <div>
                                <Label className="text-xs text-gray-600">Bulan</Label>
                                <Input
                                    type="text"
                                    name="bulan"
                                    value={data.bulan}
                                    onChange={handleChange}
                                    className="placeholder:text-gray-400"
                                    required
                                />
                                {errors.bulan && <InputError message={errors.bulan} className="mt-2" />}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Tahun</Label>
                                <Input
                                    type="number"
                                    name="tahun"
                                    value={data.tahun}
                                    onChange={handleChange}
                                    className="placeholder:text-gray-400"
                                    required
                                />
                                {errors.tahun && <InputError message={errors.tahun} className="mt-2" />}
                            </div>
                             <div>
                                <Label className="text-xs text-gray-600">Total Panen (kg)</Label>
                                <Input
                                    type="number"
                                    name="total_panen"
                                    value={data.total_panen}
                                    onChange={handleChange}
                                    className="placeholder:text-gray-400"
                                    step="0.01"
                                    required
                                />
                                {errors.total_panen && <InputError message={errors.total_panen} className="mt-2" />}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Kecamatan</Label>
                                <Input
                                    type="text"
                                    name="kecamatan"
                                    value={data.kecamatan}
                                    onChange={handleChange}
                                    className="placeholder:text-gray-400"
                                    required
                                />
                                {errors.kecamatan && <InputError message={errors.kecamatan} className="mt-2" />}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Desa</Label>
                                <Input
                                    type="text"
                                    name="desa"
                                    value={data.desa}
                                    onChange={handleChange}
                                    className="placeholder:text-gray-400"
                                    required
                                />
                                {errors.desa && <InputError message={errors.desa} className="mt-2" />}
                            </div>

                        </div>
                    </CardDescription>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle>Input Hasil Panen Jenis Rumput Laut</CardTitle>
                    </CardHeader>
                    <CardDescription>
                        <div className='mt-4'>
                            <Label className="text-xs text-gray-600">Jenis Rumput Laut</Label>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                {data.jenisRumputLaut.map((jenis: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 rounded bg-gray-50 p-2">
                                        <Input
                                            type="text"
                                            name={`jenisRumputLaut.${index}.nama`}
                                            value={jenis.nama}
                                            onChange={handleChange}
                                            className="w-max placeholder:text-gray-400"
                                            readOnly
                                            placeholder={`Jenis ${index + 1}`}
                                        />
                                        <Input
                                            type="number"
                                            name={`jenisRumputLaut.${index}.jumlah`}
                                            value={jenis.jumlah}
                                            onChange={handleChange}
                                            className="flex-1 placeholder:text-gray-400"
                                            placeholder="kg"
                                            step="0.01"
                                        />
                                    </div>
                                ))}
                                {errors.jenisRumputLaut && <InputError message={errors.jenisRumputLaut} className="mt-2" />}
                            </div>
                        </div>
                    </CardDescription>
                </CardContent>
            </Card>

            {/* Parameter Lingkungan */}
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle className="text-base md:text-xl">Parameter Lingkungan</CardTitle>
                    </CardHeader>
                    <CardDescription>
                        {indikator.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                {indikator.map((item: { nama: string; id: number }, index: number) => {
                                    if (item.nama.toLowerCase() === 'gejala') {
                                        return (
                                            <div key={index}>
                                                <Label className="text-xs text-gray-600">{item.nama}</Label>
                                                <Select
                                                    value={data.parameter[index].nilai || ''}
                                                    required
                                                    onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                                >
                                                    <SelectTrigger className="placeholder:text-gray-400">
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
                                                type="number"
                                                step={0.1}
                                                name={`parameter.${index}`}
                                                value={data.parameter[index].nilai || ''}
                                                onChange={handleChange}
                                                className="placeholder:text-gray-400"
                                                placeholder={`masukkan ${item.nama}`}
                                                required
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardDescription>
                </CardContent>
            </Card>
        </>
    );
}
