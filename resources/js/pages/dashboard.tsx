import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BarChart3, Calculator, Database, Download, Menu, RefreshCw, Settings, TrendingUp, Waves } from 'lucide-react';
// Import the default export from each file
import ConditionCard from '@/components/dashboard/ConditionCard';
import HistoricalDataTable from '@/components/dashboard/HistoricalDataTable';
import InteractiveChart from '@/components/dashboard/InteractiveChart';
import MetricsPanel from '@/components/dashboard/MetricsPanel';
import PredictionForm from '@/components/dashboard/PredictionForm';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState('overview');
    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'predictions', label: 'Predictions', icon: TrendingUp },
        { id: 'calculator', label: 'Calculator', icon: Calculator },
        { id: 'data', label: 'Historical Data', icon: Database },
        { id: 'conditions', label: 'Conditions', icon: Waves },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <header className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 lg:flex-row lg:items-center lg:gap-6">
                <div className="flex w-full items-start gap-3 md:gap-4 lg:w-auto">
                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="mt-1 flex-shrink-0 lg:hidden">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <SheetHeader>
                                <SheetTitle className="flex items-center">
                                    <Waves className="mr-2 h-6 w-6 text-primary" />
                                    SeaHarvest
                                </SheetTitle>
                            </SheetHeader>
                            <Separator className="my-4" />
                            <nav className="space-y-1">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                                                activeSection === item.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                            }`}
                                        >
                                            <Icon className="mr-3 h-4 w-4" />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </nav>
                            <Separator className="my-4" />
                            <Button variant="outline" size="sm" className="w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </SheetContent>
                    </Sheet>

                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl leading-tight font-bold tracking-tight md:text-2xl lg:text-3xl">
                           Prediksi Panen Rumput Laut Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground md:text-base">
                            Monitor dan prediksi hasil panen menggunakan regresi linier berganda
                        </p>
                    </div>
                </div>
                <div className="flex w-full items-center justify-end gap-2 lg:w-auto">
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                        <RefreshCw className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Refresh Data</span>
                        <span className="sm:hidden">Refresh</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs md:text-sm">
                        <Download className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                        <span className="hidden sm:inline">Export</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                    <Button variant="outline" size="icon" className="hidden lg:flex">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            <div className="mb-4 grid grid-cols-1 gap-4 md:mb-6 md:gap-6 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-lg md:text-xl">Harvest Yield Predictions</CardTitle>
                        <CardDescription className="text-sm md:text-base">Predicted vs actual harvest yields over time</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6">
                        <InteractiveChart />
                    </CardContent>
                </Card>
                {/* Metrics panel */}
                <MetricsPanel />
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:mb-6 md:gap-6 xl:grid-cols-3">
                {/* Prediction Form */}
                <PredictionForm />

                <Card className="order-1 xl:order-2 xl:col-span-2">
                    <CardHeader className="pb-3 md:pb-6">
                        <CardTitle className="text-lg md:text-xl">Harvesting Conditions</CardTitle>
                        <CardDescription className="text-sm md:text-base">
                            Current environmental conditions and optimal harvesting status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 md:p-6">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                            <ConditionCard title="Water Temperature" value="24.5°C" status="optimal" range="22-26°C" />
                            <ConditionCard title="Salinity" value="32 ppt" status="warning" range="30-35 ppt" />
                            <ConditionCard title="Light Exposure" value="High" status="optimal" range="Medium-High" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <HistoricalDataTable />
        </AppLayout>
    );
}
