import { DeleteConfirmationForm } from '@/components/delete-confirmation-form';
import PaginationTable from '@/components/pagination-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { EyeIcon, PenBoxIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
interface RiwayatViewProps {
    riwayatPengguna: {
        current_page: number;
        data: {
            id: number;
            user: { name: string; email: string };
            model:any;
        }[];
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

export default function RiwayatView({ riwayatPengguna, breadcrumb, titlePage }: RiwayatViewProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const [isDeleteDialog, setisDeleteDialog] = useState(false);
    console.log(riwayatPengguna.data[0])
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage ?? 'Riwayat Pengguna'} />

            {/* Data */}
            <Card>
                <div className="container mx-auto px-4">
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold md:text-xl">Data Riwayat Prediksi Pengguna</h2>
                    </div>
                    <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="cursor-pointer">no</TableHead>
                                    <TableHead className="cursor-pointer">user</TableHead>
                                    <TableHead className="cursor-pointer">email</TableHead>
                                    <TableHead className="cursor-pointer">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {riwayatPengguna.data && riwayatPengguna.data.length ? (
                                    riwayatPengguna.data.map((item, index) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{item.user.name}</TableCell>
                                            <TableCell>{item.user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-row items-center gap-2">
                                                    <DeleteConfirmationForm
                                                        title={`Hapus riwayatPengguna ${item.id}`}
                                                        id={item.id}
                                                        url={route('admin.riwayatPengguna.destroy', { riwayatPengguna: item.id })}
                                                        setOpenDialog={setisDeleteDialog}
                                                    />
                                                    <Link href={route('admin.riwayatPengguna.show', {riwayatPengguna: item.id})}>
                                                    <Button variant={'default'} type='button' className='bg-chart-1'>
                                                        <EyeIcon size={4} />
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
                        <PaginationTable links={riwayatPengguna.links} data={riwayatPengguna} />
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}
