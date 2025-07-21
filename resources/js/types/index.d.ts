import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    flash: {
        success?: string;
        error?: string;
    }
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface IndikatorTypes {
    id: number;
    nama: string;
    keterangan: string;
    attribut: {
        batas: number;
        operator: string;
        nilai: string;
    }[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface HasilPanenTypes {
    id: number | null;
    bulan: string;
    tahun: string;
    total_panen: number;
    jenisRumputLaut: {nama: string; jumlah: number}[];
    parameter: {indikator_id: number; nilai: string | null}[];
    [key: string]: unknown; // This allows for additional properties...
}
export interface ParameterHasilPanenTypes {
    panjangGarisPantai: number;
    jumlahPetani: number;
    luasPotensi: number;
    luasTanam: number;
    jumlahTali: number;
    jumlahBibit: number;
    suhuAir: number;
    salinitas: number;
    kejernihanAir: string;
    cahayaMatahari: string;
    arusAir: string;
    kedalamanAir: number;
    phAir: number;
    ketersediaanNutrisi: string;
}

export interface SeaweedType {
    nama: string;
    jumlah: number;
};

