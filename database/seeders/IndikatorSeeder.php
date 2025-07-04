<?php

namespace Database\Seeders;

use App\Models\Indikator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IndikatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $indikators = array(
            array('nama' => 'Panjang garis pantai', 'keterangan' => 'tes', 'created_at' => '2025-07-03 08:26:48', 'updated_at' => '2025-07-03 08:26:48'),
            array('nama' => 'Petani rumput laut', 'keterangan' => 'jumlah Petani rumput laut', 'created_at' => '2025-07-03 08:26:59', 'updated_at' => '2025-07-03 08:26:59'),
            array('nama' => 'Potensi luas lahan (Ha)', 'keterangan' => 'Potensi luas lahan (Ha)', 'created_at' => '2025-07-03 08:27:07', 'updated_at' => '2025-07-03 08:27:07'),
            array('nama' => 'Luas tanam (Ha)', 'keterangan' => 'Luas tanam (Ha)', 'created_at' => '2025-07-03 08:28:57', 'updated_at' => '2025-07-03 08:28:57'),
            array('nama' => 'Jumlah bentangan', 'keterangan' => 'Jumlah bentangan', 'created_at' => '2025-07-03 08:27:24', 'updated_at' => '2025-07-03 08:27:24'),
            array('nama' => 'Jumlah bibit', 'keterangan' => 'Jumlah bibit', 'created_at' => '2025-07-03 08:27:32', 'updated_at' => '2025-07-03 08:27:32'),
            array('nama' => 'Suhu air', 'keterangan' => 'Suhu air', 'created_at' => '2025-07-03 08:27:40', 'updated_at' => '2025-07-03 08:27:40'),
            array('nama' => 'Salinitas (kadar garam)', 'keterangan' => 'Salinitas (kadar garam)', 'created_at' => '2025-07-03 08:27:49', 'updated_at' => '2025-07-03 08:27:49'),
            array('nama' => 'Kejernian / kekeruhan ai', 'keterangan' => 'Kejernian / kekeruhan ai', 'created_at' => '2025-07-03 08:27:57', 'updated_at' => '2025-07-03 08:27:57'),
            array('nama' => 'Cahaya matahari', 'keterangan' => 'Cahaya matahari', 'created_at' => '2025-07-03 08:28:04', 'updated_at' => '2025-07-03 08:28:04'),
            array('nama' => 'Arus air', 'keterangan' => 'Arus air', 'created_at' => '2025-07-03 08:28:11', 'updated_at' => '2025-07-03 08:28:11'),
            array('nama' => 'Kedalam air', 'keterangan' => 'Kedalam air', 'created_at' => '2025-07-03 08:28:18', 'updated_at' => '2025-07-03 08:28:18'),
            array('nama' => 'Ph air', 'keterangan' => 'Ph air', 'created_at' => '2025-07-03 08:28:25', 'updated_at' => '2025-07-03 08:28:25'),
            array('nama' => 'Ketersediaan nutrien', 'keterangan' => 'Ketersediaan nutrien', 'created_at' => '2025-07-03 08:28:32', 'updated_at' => '2025-07-03 08:28:32'),
        );

        Indikator::insert($indikators);
    }
}
