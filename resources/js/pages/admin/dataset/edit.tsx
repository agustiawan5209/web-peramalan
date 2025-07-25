import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes, JenisTanamanTypes, KriteriaTypes, LabelTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

type JenisRumputLaut = {
    nama: string;
    jumlah: number;
};



interface PropsDatasetView {
    breadcrumb: BreadcrumbItem[];
    kriteria: KriteriaTypes[];
    jenisTanaman: JenisTanamanTypes[];
    opsiLabel: LabelTypes[];
    titlePage?: string;
    dataset?: DatasetTypes; // Added for edit functionality
}
type Form = {
    id: number;
    jenis_tanaman: string;
    label: string;
    attribut: {
        kriteria_id: number;
        nilai: string | null;
    }[];
};

export default function EditDatasetView({ breadcrumb, kriteria, jenisTanaman, titlePage, dataset , opsiLabel}: PropsDatasetView) {
    const breadcrumbs: BreadcrumbItem[] = breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : [];

    // Initialize form with existing dataset data if available
    const { data, setData, put, processing, errors } = useForm<Form>({
        id: dataset?.id ?? 0,
        jenis_tanaman: dataset?.jenis_tanaman || '',
        label: dataset?.label || '',
        attribut: kriteria.map((kriteriaItem, index) => {
            // Find the existing attribute value if editing
            const existingAttribut = dataset?.detail.find(attr => attr.kriteria_id === kriteriaItem.id);
            return {
                kriteria_id: kriteriaItem.id,
                nilai: existingAttribut?.nilai || null
            };
        }),
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use put instead of post for update
        put(route('admin.dataset.update', data.id), {
            onError: (err) => {
                console.log(err);
            },
            onSuccess: () => {
                // Optional: Add success message or redirect
            },
        });
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
                    attribut: {
                        ...prevData.attribut,
                        [name]: value,
                    },
                }));
            }
        } else {
            console.error('Invalid data: name, value, or attribut may be undefined');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Edit Data Dataset Tanaman'} />
            <div className="mx-auto max-w-7xl rounded-xl border border-gray-100 bg-white p-6 shadow">
                <h1 className="mb-6 text-center text-xl font-semibold text-primary">Edit Data Dataset Tanaman</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informasi Dasar */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <Label className="text-xs text-gray-600">Jenis Tanaman</Label>
                            <Select value={data.jenis_tanaman} required onValueChange={(value) => handleSelectChange('jenis_tanaman', value)}>
                                <SelectTrigger className="input-minimal">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jenisTanaman.map((item: any, index) => (
                                        <SelectItem key={index} value={item.nama}>
                                            {item.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.jenis_tanaman && <InputError message={errors.jenis_tanaman} className="mt-2" />}
                        </div>
                        <div>
                            <Label className="text-xs text-gray-600">Label</Label>
                            <Select value={data.label} required onValueChange={(value) => handleSelectChange('label', value)}>
                                <SelectTrigger className="input-minimal">
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    {opsiLabel.map((item: any, index) => (
                                        <SelectItem key={index} value={item.nama}>
                                            {item.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.label && <InputError message={errors.label} className="mt-2" />}
                        </div>
                    </div>

                    {/* Parameter Lingkungan */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {kriteria.map((item: any, index: number) => {
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
                            Update Data
                        </Button>
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
