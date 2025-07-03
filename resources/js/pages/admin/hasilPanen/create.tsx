import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndikatorTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';

type SeaweedType = {
    name: string;
    amount: number;
};

type HarvestData = {
    month: string;
    year: string;
    totalHarvest: number;
    seaweedTypes: SeaweedType[];
    parameters: {
        coastlineLength: number;
        farmersCount: number;
        potentialArea: number;
        plantedArea: number;
        ropeLinesCount: number;
        seedlingAmount: number;
        waterTemperature: number;
        salinity: number;
        waterClarity: string;
        sunlight: string;
        waterCurrent: string;
        waterDepth: number;
        waterPh: number;
        nutrientsAvailability: string;
    };
};

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const clarityOptions = ['Sangat Jernih', 'Jernih', 'Agak Keruh', 'Keruh', 'Sangat Keruh'];
const sunlightOptions = ['Sangat Cerah', 'Cerah', 'Berawan', 'Mendung', 'Gelap'];
const currentOptions = ['Sangat Kuat', 'Kuat', 'Sedang', 'Lemah', 'Sangat Lemah'];
const nutrientOptions = ['Melimpah', 'Cukup', 'Terbatas', 'Sangat Sedikit'];

interface SeaweedProps {
    breadcrumb: BreadcrumbItem[];
    indikator: IndikatorTypes[];
    titlePage?: string;
}

export default function SeaweedHarvestForm({ breadcrumb, indikator, titlePage }: SeaweedProps) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];
    const { data, setData, post, processing, errors } = useForm<HarvestData>({
        month: '',
        year: new Date().getFullYear().toString(),
        totalHarvest: 0,
        seaweedTypes: [
            { name: '', amount: 0 },
            { name: '', amount: 0 },
        ],
        parameters: {
            coastlineLength: 0,
            farmersCount: 0,
            potentialArea: 0,
            plantedArea: 0,
            ropeLinesCount: 0,
            seedlingAmount: 0,
            waterTemperature: 0,
            salinity: 0,
            waterClarity: '',
            sunlight: '',
            waterCurrent: '',
            waterDepth: 0,
            waterPh: 0,
            nutrientsAvailability: '',
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('seaweedTypes')) {
            const [_, index, field] = name.split('.');
            const updatedTypes = [...data.seaweedTypes];
            updatedTypes[parseInt(index)] = {
                ...updatedTypes[parseInt(index)],
                [field]: field === 'amount' ? parseFloat(value) : value,
            };
            setData({ ...data, seaweedTypes: updatedTypes });
        } else if (name.startsWith('parameters.')) {
            const field = name.split('.')[1];
            setData({
                ...data,
                parameters: {
                    ...data.parameters,
                    [field]:
                        field.includes('water') || field.includes('sunlight') || field.includes('current') || field.includes('nutrients')
                            ? value
                            : parseFloat(value),
                },
            });
        } else {
            setData({
                ...data,
                [name]: name === 'totalHarvest' ? parseFloat(value) : value,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Tambahkan logika submit di sini
        console.log('Data dikirim:', data);
    };
    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && data && data.parameters) {

            setData(prevData => ({
                ...prevData,
                parameters: {
                    ...prevData.parameters,
                    [name]: value,
                },
            }));
        } else {
            console.error("Invalid data: name, value, or parameters may be undefined");
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Input Data Panen Rumput Laut'} />
            <div className="mx-auto max-w-7xl rounded-xl border border-gray-100 bg-white p-6 shadow">
                <h1 className="mb-6 text-center text-xl font-semibold text-primary">Input Data Panen Rumput Laut</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label className="text-xs text-gray-600">Bulan</Label>

                            <Select
                                value={data.month}
                                required
                                onValueChange={(value) => handleSelectChange('month', value)}
                            >
                                <SelectTrigger className="input-minimal">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month} value={month}>
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs text-gray-600">Tahun</Label>
                            <Input type="number" name="year" value={data.year} onChange={handleChange} className="input-minimal" required />
                        </div>
                        <div>
                            <Label className="text-xs text-gray-600">Total Panen (kg)</Label>
                            <Input
                                type="number"
                                name="totalHarvest"
                                value={data.totalHarvest}
                                onChange={handleChange}
                                className="input-minimal"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    {/* Jenis Rumput Laut */}
                    <div>
                        <Label className="text-xs text-gray-600">Jenis Rumput Laut</Label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {data.seaweedTypes.map((type, index) => (
                                <div key={index} className="flex items-center gap-2 rounded bg-gray-50 p-2">
                                    <Input
                                        type="text"
                                        name={`seaweedTypes.${index}.name`}
                                        value={type.name}
                                        onChange={handleChange}
                                        className="input-minimal flex-1"
                                        placeholder={`Jenis ${index + 1}`}
                                    />
                                    <Input
                                        type="number"
                                        name={`seaweedTypes.${index}.amount`}
                                        value={type.amount}
                                        onChange={handleChange}
                                        className="input-minimal w-24"
                                        placeholder="kg"
                                        step="0.01"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parameter Lingkungan */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div>
                                <Label className="text-xs text-gray-600">Panjang Garis Pantai (km)</Label>
                                <Input
                                    type="number"
                                    name="parameters.coastlineLength"
                                    value={data.parameters.coastlineLength}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Jumlah Petani</Label>
                                <Input
                                    type="number"
                                    name="parameters.farmersCount"
                                    value={data.parameters.farmersCount}
                                    onChange={handleChange}
                                    className="input-minimal"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Luas Potensi (Ha)</Label>
                                <Input
                                    type="number"
                                    name="parameters.potentialArea"
                                    value={data.parameters.potentialArea}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Luas Tanam (Ha)</Label>
                                <Input
                                    type="number"
                                    name="parameters.plantedArea"
                                    value={data.parameters.plantedArea}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Jumlah Tali</Label>
                                <Input
                                    type="number"
                                    name="parameters.ropeLinesCount"
                                    value={data.parameters.ropeLinesCount}
                                    onChange={handleChange}
                                    className="input-minimal"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Bibit (kg)</Label>
                                <Input
                                    type="number"
                                    name="parameters.seedlingAmount"
                                    value={data.parameters.seedlingAmount}
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
                                    name="parameters.waterTemperature"
                                    value={data.parameters.waterTemperature}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Salinitas (ppt)</Label>
                                <Input
                                    type="number"
                                    name="parameters.salinity"
                                    value={data.parameters.salinity}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Kejernihan Air</Label>
                                <Select
                                    value={data.parameters.waterClarity}
                                    onValueChange={(value) => handleSelectChange('waterClarity', value)}
                                >
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clarityOptions.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Cahaya Matahari</Label>

                                <Select value={data.parameters.sunlight} onValueChange={(value) => handleSelectChange('sunlight', value)}>
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sunlightOptions.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Arus Air</Label>

                                <Select
                                    value={data.parameters.waterCurrent}
                                    onValueChange={(value) => handleSelectChange('waterCurrent', value)}
                                >
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentOptions.map((option) => (
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
                                    name="parameters.waterDepth"
                                    value={data.parameters.waterDepth}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">pH Air</Label>
                                <Input
                                    type="number"
                                    name="parameters.waterPh"
                                    value={data.parameters.waterPh}
                                    onChange={handleChange}
                                    className="input-minimal"
                                    step="0.1"
                                    min="0"
                                    max="14"
                                />
                            </div>
                            <div>
                                <Label className="text-xs text-gray-600">Ketersediaan Nutrisi</Label>

                                <Select value={data.parameters.nutrientsAvailability} onValueChange={(value) => handleSelectChange('nutrientsAvailability', value)}>
                                    <SelectTrigger className="input-minimal">
                                        <SelectValue placeholder="Pilih" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nutrientOptions.map((option) => (
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
            {/* Tambahkan style minimalis di bawah jika belum ada di app.css */}
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
