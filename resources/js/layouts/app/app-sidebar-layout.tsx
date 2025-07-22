import { Button } from '@/components/ui/button';
import { BarChart3, ChartColumnIncreasing, Clock10, Database, IndentIcon, Link2Icon, Settings, Waves } from 'lucide-react';
// Import the default export from each file
import { Breadcrumbs } from '@/components/breadcrumbs';
import { cn } from '@/lib/utils';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cva } from 'class-variance-authority';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { Toast } from '@/components/ui/toast';
import { title } from 'process';
import { NavUser } from '@/components/nav-user';
import { NavigationButtons } from '@/components/ui/navigation-menu-button';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const activeSection = usePage().url.split('/').pop() || 'Dashboard';
    // console.log('Active Section:', activeSection);

    const navigationItems = [
        { title: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { title: 'Indikator', href: '/admin/indikator', icon: IndentIcon },
        { title: 'Data-Panen', href: '/admin/hasil-panen', icon: Database },
        { title: 'Pola-Asosiasi', href: '/fpgrowth', icon: Link2Icon },
        { title: 'Regresi Linear Berganda', href: '/prediction', icon: ChartColumnIncreasing },
        { title: 'Riwayat Prediksi', href: '/admin/riwayat', icon: Clock10 },
    ];

    const page = usePage<SharedData>();
    const { flash } = page.props;

    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({
        title: '',
        description: '',
        variant: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        if(flash.success || flash.error) {
            // If there's a flash message, open the toast
            setOpenToast(true);
        }
        if(flash.success) {
            // If there's a success message, set the toast message
            setToastMessage({
                title: 'Success',
                description: flash.success,
                variant: 'success',
            });
        }
        if(flash.error) {
            // If there's an error message, set the toast message
            setToastMessage({
                title: 'Error',
                description: flash.error,
                variant: 'error',
            });
        }

    }, [flash])
    const closeToast = () => {
        // This function is called when the toast is closed
        setOpenToast(false);

    };

    return (
        <div className="flex min-h-screen bg-background">
            <Toast open={openToast} onOpenChange={setOpenToast} title={toastMessage.title} description={toastMessage.description} duration={5000} variant={toastMessage.variant}  />

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card lg:flex">
                <div className="flex h-16 items-center border-b px-4">
                    <Waves className="h-8 w-8 text-primary" />
                    <span className="ml-2 truncate text-lg font-semibold">SeaHarvest</span>
                </div>
                <nav className="flex-1 space-y-3 overflow-y-auto px-2 py-4">
                    <div className="flex flex-col gap-4">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavigationButtons
                                    title={item.title}
                                    isActive={activeSection === item.title.toLowerCase()}
                                    variant="default"
                                    href={item.href}
                                    key={item.title}
                                    icon={Icon}
                                    className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors`}
                                />
                            );
                        })}
                    </div>
                </nav>
                <div className="border-t p-4">
                    <NavUser />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex min-w-0 flex-1 flex-col lg:ml-60">

                <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-sidebar-border/50 bg-background px-4 md:px-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </header>
                <section className="max-w-full flex-1 overflow-auto p-4 md:p-6">{children}</section>
            </main>
        </div>
    );
}

