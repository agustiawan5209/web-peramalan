<?php

namespace Database\Seeders;

use App\Models\HasilPanen;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HasilPanenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tahun = ['2023', '2024', '2025'];
        $bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        foreach ($tahun as $val_tahun) {
            foreach ($bulan as $key => $value) {
                HasilPanen::create([
                    "bulan" => $value,
                    "tahun" => $val_tahun,
                    "total_panen" => fake()->numberBetween(1000, 5000),
                    "jenisRumputLaut" => [
                        ["nama" => "eucheuma_conttoni_basah", "jumlah" => fake()->numberBetween(500, 1000)],
                        ["nama" => "eucheuma_conttoni_kering", "jumlah" => fake()->numberBetween(500, 1000)],
                        ["nama" => "eucheuma_spinosum_basah", "jumlah" => fake()->numberBetween(500, 1000)],
                        ["nama" => "eucheuma_spinosum_kering", "jumlah" => fake()->numberBetween(500, 1000)]
                    ],
                    "parameter" => [
                        ["nilai" => fake()->numberBetween(100,500), "indikator_id" => 1],
                        ["nilai" => fake()->numberBetween(100,500), "indikator_id" => 2],
                        ["nilai" => fake()->numberBetween(300,600), "indikator_id" => 3],
                        ["nilai" => fake()->numberBetween(300,600), "indikator_id" => 4],
                        ["nilai" => fake()->numberBetween(100,300), "indikator_id" => 5],
                        ["nilai" => fake()->numberBetween(130,300), "indikator_id" => 6],
                        ["nilai" => fake()->numberBetween(28,35), "indikator_id" => 7],
                        ["nilai" => fake()->numberBetween(28,35), "indikator_id" => 8]
                    ],

                ]);
            }
        }
    }
}
