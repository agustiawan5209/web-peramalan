import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndikatorTypes } from '@/types';

type JenisRumputLaut = {
    nama: string;
    jumlah: number;
};

interface ParameterTransaction {
    indikator_id: number;
    nilai: string | null;
}

const daftarBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const opsiKejernihan = [
    { value: 5, label: 'Sangat Jernih' },
    { value: 4, label: 'Jernih' },
    { value: 3, label: 'Agak Keruh' },
    { value: 2, label: 'Keruh' },
    { value: 1, label: 'Sangat Keruh' },
];
const opsiCahaya = [
    { value: 5, label: 'Sangat Cerah' },
    { value: 4, label: 'Cerah' },
    { value: 3, label: 'Berawan' },
    { value: 2, label: 'Mendung' },
    { value: 1, label: 'Gelap' },
];
const opsiArus = [
    { value: 5, label: 'Sangat Kuat' },
    { value: 4, label: 'Kuat' },
    { value: 3, label: 'Sedang' },
    { value: 2, label: 'Lemah' },
    { value: 1, label: 'Sangat Lemah' },
];
const opsiNutrisi = [
    { value: 4, label: 'Melimpah' },
    { value: 3, label: 'Cukup' },
    { value: 2, label: 'Terbatas' },
    { value: 1, label: 'Sangat Sedikit' },
];
interface PropsPanenRumputLaut {
    parameter: ParameterTransaction[];
    indikator: IndikatorTypes[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function FormPanen({ parameter, indikator, handleChange }: PropsPanenRumputLaut) {

    return (
        <>
            <div className="block">
                {/* Parameter Lingkungan */}
                {indikator.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {indikator.map((item: { nama: string; id: number }, index: number) => {
                            return (
                                <div key={index}>
                                    <Label className="text-xs text-gray-600">{item.nama}</Label>
                                    <Input
                                        type="number"
                                        step={0.1}
                                        name={`parameter.${index}`}
                                        value={parameter[index]?.nilai || ''}
                                        onChange={handleChange}
                                        className="placeholder:text-gray-400"
                                        placeholder={`masukkan ${item.nama}`}
                                        required
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
