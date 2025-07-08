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
        $bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        $hasil_panens = array(
            array(
                "id" => 1,
                "bulan" => "Januari",
                "tahun" => 2024,
                "total_panen" => "2000",
                "jenisRumputLaut" => json_encode([["nama" => "eucheuma_conttoni", "jumlah" => 1000], ["nama" => "gracilaria_sp", "jumlah" => 1000]]),
                "parameter" =>  json_encode([
                    "panjangGarisPantai" => 4,
                    "jumlahPetani" => 200,
                    "luasPotensi" => 4,
                    "luasTanam" => 5,
                    "jumlahTali" => 1000,
                    "jumlahBibit" => 1000,
                    "suhuAir" => 34,
                    "salinitas" => 40,
                    "kejernihanAir" => "Jernih",
                    "cahayaMatahari" => "Berawan",
                    "arusAir" => "Sedang",
                    "kedalamanAir" => 2,
                    "phAir" => 7,
                    "ketersediaanNutrisi" => "Cukup"
                ]),
                "keterangan" => "TEST",
                "created_at" => "2025-07-03 14:04:16",
                "updated_at" => "2025-07-08 11:50:09",
            ),
        );

        foreach($bulan as $key=> $value){
            HasilPanen::create([
                "bulan" => $value,
                "tahun" => 2024,
                "total_panen" => fake()->numberBetween(1000, 5000),
                "jenisRumputLaut" => json_encode([
                    ["nama" => "eucheuma_conttoni", "jumlah" => fake()->numberBetween(500, 2000)],
                    ["nama" => "gracilaria_sp", "jumlah" => fake()->numberBetween(500, 2000)]
                ]),
                "parameter" => json_encode([
                    "panjangGarisPantai" => fake()->numberBetween(1, 10),
                    "jumlahPetani" => fake()->numberBetween(50, 500),
                    "luasPotensi" => fake()->numberBetween(1, 10),
                    "luas_tanam"=> fake()->numberBetween(3,8),
                    "jumlahTali"=>   fake()->numberBetween(500, 2000),
                    "jumlahBibit"=>   fake()->numberBetween(500, 2000),
                    "suhuAir"=>   fake()->numberBetween(30, 35),
                    "salinitas"=> fake()->numberBetween(10, 50),
                    "kejernihanAir"=> fake()->randomElement(['Sangat Jernih', 'Jernih', 'Agak Keruh', 'Keruh', 'Sangat Keruh']),
                    "cahayaMatahari"=> fake()->randomElement(['Sangat Cerah', 'Cerah', 'Berawan', 'Mendung', 'Gelap']),
                    "arusAir"=> fake()->randomElement(['Sangat Cerah', 'Cerah', 'Berawan', 'Mendung', 'Gelap']),
                    "kedalamanAir"=> fake()->numberBetween(2,7),
                    "pHAir"=> fake()->numberBetween(3,8),
                    "ketersediaanNutrisi"=> fake()->randomElement( ['Melimpah', 'Cukup', 'Terbatas', 'Sangat Sedikit']),
                ]),

            ]);
        }
    }
}
