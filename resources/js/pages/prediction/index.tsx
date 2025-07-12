import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as tf from '@tensorflow/tfjs';
import { motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
interface Transaction {
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
    pHAir: number;
    ketersediaanNutrisi: string;
    eucheuma_conttoni: number;
    gracilaria_sp: number;
}
interface MultipleLinearRegressionProps {
    breadcrumb?: BreadcrumbItem[];
    titlePage?: string;
    transaction: Transaction[];
}

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

const MultipleLinearRegression: React.FC<MultipleLinearRegressionProps> = ({ breadcrumb, titlePage, transaction }: MultipleLinearRegressionProps) => {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => (breadcrumb ? breadcrumb.map((item) => ({ title: item.title, href: item.href })) : []),
        [breadcrumb],
    );

    const [model, setModel] = useState<tf.Sequential | null>(null);
    const [training, setTraining] = useState(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [input1, setInput1] = useState<string>('');
    const [input2, setInput2] = useState<string>('');

    const HeaderTabel = [
        'panjangGarisPantai',
        'jumlahPetani',
        'luasPotensi',
        'luasTanam',
        'jumlahTali',
        'jumlahBibit',
        'suhuAir',
        'salinitas',
        'kejernihanAir',
        'cahayaMatahari',
        'arusAir',
        'kedalamanAir',
        'pHAir',
        'ketersediaanNutrisi',
        'eucheuma_conttoni',
        'gracilaria_sp',
    ];
    useEffect(() => {
        // Inisialisasi model saat komponen mount
        const initModel = () => {
            const model = tf.sequential();
            model.add(
                tf.layers.dense({
                    units: 1,
                    inputShape: [15], // 15 variabel input
                }),
            );
            return model;
        };

        setModel(initModel());
        return () => {
            // Cleanup
            if (model) {
                model.dispose();
            }
        };
    }, []);

    const [data, setData] = useState<Transaction[]>(transaction || []);

    const trainModel = async () => {
        if (!model) return;

        setTraining(true);

        // Persiapan data
        const xs = tf.tensor2d(
            data.map((point) => {
                let kejernihan = opsiKejernihan.find((item) => item.label === point.kejernihanAir)?.value || 0;
                let cahaya = opsiCahaya.find((item) => item.label === point.cahayaMatahari)?.value || 0;
                let arus = opsiArus.find((item) => item.label === point.arusAir)?.value || 0;
                let nutrisi = opsiNutrisi.find((item) => item.label === point.ketersediaanNutrisi)?.value || 0;

                return [
                    1, // intercept
                    point.panjangGarisPantai,
                    point.jumlahPetani,
                    point.luasPotensi,
                    point.luasTanam,
                    point.jumlahTali,
                    point.jumlahBibit,
                    point.suhuAir,
                    point.salinitas,
                    kejernihan,
                    cahaya,
                    arus,
                    point.kedalamanAir,
                    point.pHAir,
                    nutrisi,
                ];
            }),
        );

        // Memisahkan untuk dua variabel dependen
        const ys = tf.tensor2d(data.map((point) => [point.eucheuma_conttoni]));
        // Kompilasi model
        model.compile({
            optimizer: tf.train.sgd(0.01),
            loss: tf.losses.meanSquaredError,
        });

        // Pelatihan
        await model.fit(xs, ys, {
            epochs: 100,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
                },
            },
        });

        // Dispose tensors
        xs.dispose();
        ys.dispose();

        setTraining(false);
    };

    const [parameter, setParameter] = useState<Transaction>({
        panjangGarisPantai: 0,
        jumlahPetani: 0,
        luasPotensi: 0,
        luasTanam: 0,
        jumlahTali: 0,
        jumlahBibit: 0,
        suhuAir: 0,
        salinitas: 0,
        kejernihanAir: '',
        cahayaMatahari: '',
        arusAir: '',
        kedalamanAir: 0,
        pHAir: 0,
        ketersediaanNutrisi: '',
        eucheuma_conttoni: 0,
        gracilaria_sp: 0,
    });
    const predict = () => {
        if (!model || !parameter) return;

        // Convert categorical fields to numeric values
        let kejernihan = opsiKejernihan.find((item) => item.label === parameter.kejernihanAir)?.value || 0;
        let cahaya = opsiCahaya.find((item) => item.label === parameter.cahayaMatahari)?.value || 0;
        let arus = opsiArus.find((item) => item.label === parameter.arusAir)?.value || 0;
        let nutrisi = opsiNutrisi.find((item) => item.label === parameter.ketersediaanNutrisi)?.value || 0;

        const inputArr = [
            1, // intercept
            parameter.panjangGarisPantai,
            parameter.jumlahPetani,
            parameter.luasPotensi,
            parameter.luasTanam,
            parameter.jumlahTali,
            parameter.jumlahBibit,
            parameter.suhuAir,
            parameter.salinitas,
            kejernihan,
            cahaya,
            arus,
            parameter.kedalamanAir,
            parameter.pHAir,
            nutrisi,
        ];

        const inputTensor = tf.tensor2d([inputArr]);
        const outputTensor = model.predict(inputTensor) as tf.Tensor;
        const output = outputTensor.dataSync()[0];

        // Update state dan cleanup
        setPrediction(output);
        inputTensor.dispose();
        outputTensor.dispose();
    };

    const [showTable, setShowTable] = useState<boolean>(false);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setParameter({
            ...parameter,
            [name]: parseFloat(value),
        });
    };
    const handleSelectChange = (name: string, value: string) => {
        if (name && value !== undefined && parameter) {
            setParameter((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else {
            console.error('Invalid data: name, value, or parameter may be undefined');
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={titlePage || 'Regresi Linear Berganda'} />
            <div className="container mx-auto max-w-7xl px-6 py-3">
                <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-gray-900">Regresi Linear Berganda</h1>

                <section className="mb-10 rounded-xl bg-white p-6 shadow-md">
                    <Button type="button" variant={'default'} onClick={() => setShowTable(showTable ? false : true)}>
                        Tampilkan Data Panen
                    </Button>
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">Data Input</h2>
                    {showTable && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="w-full overflow-auto"
                        >
                            <Table className="w-full border-separate border-spacing-y-2 text-left">
                                <TableHeader>
                                    <TableRow>
                                        {HeaderTabel &&
                                            HeaderTabel.map((item, index) => (
                                                <TableHead key={index} className="px-3 py-2 font-medium text-gray-600">
                                                    {item}
                                                </TableHead>
                                            ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((point: any, index) => (
                                        <TableRow key={index} className="bg-gray-50 transition hover:bg-gray-100">
                                            {HeaderTabel.map((key: number | string) => (
                                                <TableCell key={key} className="px-3 py-2">
                                                    {typeof point[key] === 'number' ? point[key].toFixed(2) : point[key]}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </motion.div>
                    )}
                </section>

                <section className="mb-10 rounded-xl bg-white p-6 shadow-md">
                    <h2 className="mb-6 text-xl font-semibold text-gray-800">Input Parameter</h2>
                    <form
                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            predict();
                        }}
                    >
                        <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-xs text-gray-600">Panjang Garis Pantai (km)</Label>
                                    <Input
                                        type="number"
                                        name="panjangGarisPantai"
                                        value={parameter.panjangGarisPantai}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Jumlah Petani</Label>
                                    <Input
                                        type="number"
                                        name="jumlahPetani"
                                        value={parameter.jumlahPetani}
                                        onChange={handleChange}
                                        className="input-minimal"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Luas Potensi (Ha)</Label>
                                    <Input
                                        type="number"
                                        name="luasPotensi"
                                        value={parameter.luasPotensi}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Luas Tanam (Ha)</Label>
                                    <Input
                                        type="number"
                                        name="luasTanam"
                                        value={parameter.luasTanam}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Jumlah Tali</Label>
                                    <Input
                                        type="number"
                                        name="jumlahTali"
                                        value={parameter.jumlahTali}
                                        onChange={handleChange}
                                        className="input-minimal"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Bibit (kg)</Label>
                                    <Input
                                        type="number"
                                        name="jumlahBibit"
                                        value={parameter.jumlahBibit}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-xs text-gray-600">Suhu Air (°C)</Label>
                                    <Input
                                        type="number"
                                        name="suhuAir"
                                        value={parameter.suhuAir}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Salinitas (ppt)</Label>
                                    <Input
                                        type="number"
                                        name="salinitas"
                                        value={parameter.salinitas}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Kejernihan Air</Label>
                                    <Select value={parameter.kejernihanAir} onValueChange={(value) => handleSelectChange('kejernihanAir', value)}>
                                        <SelectTrigger className="input-minimal">
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opsiKejernihan.map((option) => (
                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Cahaya Matahari</Label>
                                    <Select value={parameter.cahayaMatahari} onValueChange={(value) => handleSelectChange('cahayaMatahari', value)}>
                                        <SelectTrigger className="input-minimal">
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opsiCahaya.map((option) => (
                                                 <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Arus Air</Label>
                                    <Select value={parameter.arusAir} onValueChange={(value) => handleSelectChange('arusAir', value)}>
                                        <SelectTrigger className="input-minimal">
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opsiArus.map((option) => (
                                                 <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Kedalaman Air (m)</Label>
                                    <Input
                                        type="number"
                                        name="kedalamanAir"
                                        value={parameter.kedalamanAir}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">pH Air</Label>
                                    <Input
                                        type="number"
                                        name="pHAir"
                                        value={parameter.pHAir}
                                        onChange={handleChange}
                                        className="input-minimal"
                                        step="0.1"
                                        min="0"
                                        max="14"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-600">Ketersediaan Nutrisi</Label>
                                    <Select
                                        value={parameter.ketersediaanNutrisi}
                                        onValueChange={(value) => handleSelectChange('ketersediaanNutrisi', value)}
                                    >
                                        <SelectTrigger className="input-minimal">
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opsiNutrisi.map((option) => (
                                                 <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 md:col-span-2">
                            <Button type="button" variant="default" onClick={trainModel} disabled={training}>
                                {training ? 'Training...' : 'Train Model'}
                            </Button>
                            <Button type="submit" variant="secondary">
                                Prediksi
                            </Button>
                        </div>
                    </form>
                    {prediction !== null && (
                        <div className="mt-6 rounded bg-green-100 p-4 font-semibold text-green-800">
                            Hasil Prediksi Eucheuma Conttoni: {prediction.toFixed(2)}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
};

export default MultipleLinearRegression;
