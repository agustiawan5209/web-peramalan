import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, DatasetTypes } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { EyeIcon, PenBoxIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
interface IndikatorIndexProps {
    dataset: {
        current_page: number;
        data: DatasetTypes[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        next_page_url?: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
}

export default function IndikatorIndex({ dataset, breadcrumb, titlePage }: IndikatorIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const [isDeleteDialog, setisDeleteDialog] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Indikator'} />

            {/* Data */}
            <Card>
                <div className="container mx-auto px-4">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Data Nutrisi Tanaman</h2>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <Link href={route('admin.dataset.create')}>
                                <Button variant={'default'} type="button" className="cursor-pointer">
                                    Tambah Data
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer">no</TableHead>
                                    <TableHead className="cursor-pointer">Jenis Tanaman</TableHead>
                                    <TableHead className="cursor-pointer">Label (Nutrisi)</TableHead>
                                    <TableHead className="cursor-pointer">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dataset.data && dataset.data.length ? (
                                    dataset.data.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.jenis_tanaman}</TableCell>
                                            <TableCell>{item.label}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-row items-center gap-2">
                                                    <DeleteConfirmationForm
                                                        title={`Hapus dataset ${item.id}`}
                                                        id={item.id}
                                                        url={route('admin.dataset.destroy', { dataset: item.id })}
                                                        setOpenDialog={setisDeleteDialog}
                                                    />
                                                    <Link href={route('admin.dataset.show', { dataset: item.id })}>
                                                        <Button variant={'default'} type="button" className="bg-chart-1">
                                                            <EyeIcon size={4} />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('admin.dataset.edit', { dataset: item.id })}>
                                                        <Button variant={'default'} type="button" className="bg-chart-4">
                                                            <PenBoxIcon size={4} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
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
                    <div className="mt-4 flex items-center justify-between">
                        <PaginationTable links={dataset.links} data={dataset} />
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
