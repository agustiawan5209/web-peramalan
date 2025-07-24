import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/guest/main-layout';
import { ArrowRight } from 'lucide-react';
import { PropsWithChildren } from 'react';

export default function UserAuthLayout({children}: PropsWithChildren<{}>) {
    return (
        <MainLayout >
            {/* Hero Section */}
           <section className='flex flex-col items-center justify-center'>
            {children}
           </section>
        </MainLayout>
    );
}
