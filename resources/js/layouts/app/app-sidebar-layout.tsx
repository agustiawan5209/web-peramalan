import { Button } from '@/components/ui/button';
import { BarChart3, Database, Settings, Waves } from 'lucide-react';
// Import the default export from each file
import { Breadcrumbs } from '@/components/breadcrumbs';
import { cn } from '@/lib/utils';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cva } from 'class-variance-authority';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { Toast } from '@/components/ui/toast';
import { title } from 'process';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const activeSection = usePage().url.split('/').pop() || 'Dashboard';
    console.log('Active Section:', activeSection);

    const navigationItems = [
        { title: 'Dashboard', href: '/dashboard', icon: BarChart3 },
        { title: 'Indikator', href: '/admin/indikator', icon: Database },
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
                    <Button variant="outline" size="sm" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
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

const NavigationButtons = ({
    title,
    href,
    isActive,
    variant = 'default',
    size = 'sm',
    icon: Icon,
    className = '',
}: {
    title: string;
    isActive: boolean;
    variant: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    href: string;
    icon: React.ComponentType;
    className?: string;
}) => {
    return (
        <Link href={href} data-slot="sidebar-menu-button" data-sidebar="menu-button" data-active={isActive}>
            <div
                className={cn(
                    sidebarMenuButtonVariants({ variant, size }),
                    className,
                    // Modern UI enhancements
                    'transition-all duration-200 ease-in-out',
                    'rounded-xl shadow-sm',
                    isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow',
                )}
            >
                {Icon && <Icon />}
                <span className="truncate font-medium tracking-wide">{title}</span>
            </div>
        </Link>
    );
};

const sidebarMenuButtonVariants = cva(
    'flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-2 text-left text-base outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: '',
                outline: 'bg-background border border-sidebar-border shadow hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            },
            size: {
                default: 'h-10 text-base',
                sm: 'h-9 text-sm',
                lg: 'h-12 text-lg',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);
