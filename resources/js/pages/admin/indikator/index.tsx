import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, IndikatorTypes } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, PenBox, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
interface IndikatorIndexProps {
    indikator: IndikatorTypes[];
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    can: {
        add: boolean;
        edit: boolean;
        read: boolean;
        delete: boolean;
    };
}
interface AttributTypes {
    batas: number;
    operator: string;
    nilai: string;
}
type indikatorFormData = {
    id: number | null;
    nama: string;
    keterangan: string;
    attribut: AttributTypes[];
};

export default function IndikatorIndex({ indikator, breadcrumb, titlePage, can }: IndikatorIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const { data, setData, get, post, put, processing, errors } = useForm<indikatorFormData>({
        id: null,
        nama: '',
        keterangan: '',
        attribut: [
            {
                batas: 0,
                operator: '',
                nilai: '',
            },
        ],
    });

    const [editId, setEditId] = useState<number | null>(null);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (editId == null) {
            post(route('admin.indikator.store'), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        nama: '',
                        keterangan: '',
                        attribut: [
                            {
                                batas: 0,
                                operator: '',
                                nilai: '',
                            },
                        ],
                    });
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        } else {
            console.log(data.attribut);
            put(route('admin.indikator.update', editId), {
                preserveState: true,
                onSuccess: () => {
                    setData({
                        id: null,
                        nama: '',
                        keterangan: '',
                        attribut: [
                            {
                                batas: 0,
                                operator: '',
                                nilai: '',
                            },
                        ],
                    });
                    setEditId(null);
                    setIsOpenDialog(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const [isOpenDialog, setIsOpenDialog] = useState(false);

    const handleEdit = (id: number) => {
        if (id) {
            const indikatorTemp: IndikatorTypes = indikator.filter((item) => item.id === id, [])[0];
            setEditId(indikatorTemp.id);
            if (indikatorTemp) {
                const parameter: AttributTypes[] =
                    indikatorTemp.attribut != null
                        ? indikatorTemp.attribut
                        : [
                              {
                                  batas: 0,
                                  operator: '',
                                  nilai: '',
                              },
                          ];

                setData({
                    id: indikatorTemp.id,
                    nama: indikatorTemp.nama,
                    keterangan: indikatorTemp.keterangan,
                    attribut: parameter,
                });
            }
            setIsOpenDialog(true);
        }
    };

    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    const [itemsBatas, setItemBatas] = useState(1);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        const key = name.split('.')[1];
        const nama = name.split('.')[0];
        console.log(key, nama);
        setData((prevData) => ({
            ...prevData,
            attribut: prevData.attribut.map((item, index) => {
                if (index === Number(key)) {
                    return {
                        ...item,
                        [nama]: value,
                    };
                }
                return item;
            }),
        }));
    };
    const addAttribut = () => {
        if (data.attribut.length < 3) {
            setData((prevData) => ({
                ...prevData,
                attribut: [
                    ...prevData.attribut,
                    {
                        batas: 0,
                        operator: '',
                        nilai: '',
                    },
                ],
            }));
        }
    };
    const removeAttribut = (index: number) => {
        setData((prevData) => ({
            ...prevData,
            attribut: prevData.attribut.filter((_, i) => i !== index),
        }));
    };

    const handleSelectChange = (key: string, value: string) => {
        setData((prevData) => ({
            ...prevData,
            attribut: prevData.attribut.map((item, index) => {
                if (index === Number(key)) {
                    return {
                        ...item,
                        operator: value,
                    };
                } else {
                    return item;
                }
            }),
        }));
    };

    const actionCan = ()  => {
        if (can.add || can.edit || can.delete) {
            return true;
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Indikator'} />

            {/* Data */}
            <Card>
                <div className="container mx-auto px-4">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Parameter Prediksi Rumput Laut</h2>
                        {can.add &&<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Button variant={'default'} type="button" className="cursor-pointer" onClick={() => setIsOpenDialog(true)}>
                                Tambah Data
                            </Button>
                        </div>}
                    </div>
                    <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer">no</TableHead>
                                    <TableHead className="cursor-pointer">Nama</TableHead>
                                    <TableHead className="cursor-pointer">keterangan</TableHead>
                                    {actionCan() && <TableHead className="cursor-pointer">Aksi</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {indikator.length > 0 ? (
                                    indikator.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>{item.keterangan}</TableCell>
                                        {actionCan()&&<TableCell>
                                            <div className="flex flex-row items-center gap-2">
                                                {can.edit && <Button
                                                    type="button"
                                                    variant={'default'}
                                                    tooltip="edit"
                                                    onClick={() => handleEdit(item.id)}
                                                    className="border border-chart-4 bg-chart-4"
                                                >
                                                    {' '}
                                                    <PenBox />{' '}
                                                </Button>}

                                                {can.delete && <DeleteConfirmationForm
                                                    title={`Hapus indikator ${item.id}`}
                                                    id={item.id}
                                                    url={route('admin.indikator.destroy', { indikator: item.id })}
                                                    setOpenDialog={setisDeleteDialog}
                                                />}
                                            </div>
                                        </TableCell>}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-4 text-center">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editId ? `Edit` : `Tambah`} Indikator</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nama" className="text-sm font-medium">
                                    Nama Indikator
                                </Label>
                                <Input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    id="nama"
                                    name="nama"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan nama indikator"
                                    readOnly={(!can.add)}
                                />
                                <InputError message={errors.nama} className="mt-2" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="keterangan" className="text-sm font-medium">
                                    Keterangan
                                </Label>
                                <Input
                                    type="text"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    id="keterangan"
                                    name="keterangan"
                                    className="input"
                                    disabled={processing}
                                    placeholder="Masukkan keterangan indikator"
                                />
                                <InputError message={errors.keterangan} className="mt-2" />
                            </div>
                            {(can.add && can.edit && can.delete) && (
                                <div className="block space-y-2">
                                {data.attribut.map((item, index) => {
                                    return (
                                        <div className="flex items-center" key={index}>
                                            <div className="">
                                                <Label htmlFor={'batas.' + index} className="text-sm font-medium">
                                                    Batas
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name={'batas.' + index}
                                                    value={data.attribut[index].batas}
                                                    onChange={handleChange}
                                                    id={'batas.' + index}
                                                    className="input"
                                                    disabled={processing}
                                                    placeholder="Masukkan batas indikator"
                                                />
                                            </div>
                                            <div className="">
                                                <Label htmlFor={'operator.' + index} className="text-sm font-medium">
                                                    Operator
                                                </Label>
                                                <Select
                                                    value={data.attribut[index].operator || ''}
                                                    required
                                                    onValueChange={(value) => handleSelectChange(index.toLocaleString(), value)}
                                                >
                                                    <SelectTrigger className="input-minimal">
                                                        <SelectValue placeholder="Pilih" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['<', '<=', '>'].map((oper: any, index) => (
                                                            <SelectItem key={index} value={oper}>
                                                                {oper}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="">
                                                <Label htmlFor={'nilai.' + index} className="text-sm font-medium">
                                                    Nilai
                                                </Label>
                                                <Input
                                                    type="text"
                                                    name={'nilai.' + index}
                                                    value={data.attribut[index].nilai}
                                                    onChange={handleChange}
                                                    id={'nilai.' + index}
                                                    className="input"
                                                    disabled={processing}
                                                    placeholder="Masukkan nilai indikator"
                                                />
                                            </div>
                                            <div>
                                                <Button type="button" variant={'destructive'} size={'sm'} onClick={() => removeAttribut(index)}>
                                                    {' '}
                                                    <XIcon />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}

                                <Button type="button" variant={'outline'} size={'sm'} onClick={addAttribut}>
                                    + Tambah Operator
                                </Button>
                            </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setIsOpenDialog(false)}>
                                Batal
                            </Button>
                            <Button type="submit">{processing && <LoaderCircle className="h-4 w-4 animate-spin" />}Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
