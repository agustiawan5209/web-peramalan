import { Button } from '@/components/ui/button';
import { BarChart3, Calculator, Database, Settings, TrendingUp, Waves } from 'lucide-react';
import { useState } from 'react';
// Import the default export from each file
import { AppContent } from '@/components/app-content';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';

export default function AppSidebarLayout({ children, breadcrumbs=[] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const [activeSection, setActiveSection] = useState('overview');

    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'predictions', label: 'Predictions', icon: TrendingUp },
        { id: 'calculator', label: 'Calculator', icon: Calculator },
        { id: 'data', label: 'Historical Data', icon: Database },
        { id: 'conditions', label: 'Conditions', icon: Waves },
    ];

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card lg:flex">
                <div className="flex h-16 items-center border-b px-4">
                    <Waves className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-lg font-semibold truncate">SeaHarvest</span>
                </div>
                <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                    activeSection === item.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                <span className="truncate">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div className="border-t p-4">
                    <Button variant="outline" size="sm" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 lg:ml-60">
                <header className="flex h-16 items-center gap-2 border-b border-sidebar-border/50 px-4 md:px-6 bg-background sticky top-0 z-20">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </header>
                <section className="flex-1 overflow-auto p-4 md:p-6 max-w-full">
                    {children}
                </section>
            </main>
        </div>
    );
}
