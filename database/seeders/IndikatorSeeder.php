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
            array(

                "nama" => "Potensi Luas Lahan (Ha)",
                "keterangan" => "Potensi Luas Lahan (Ha)",
                "attribut" => [
                    [
                        "batas" => "150",
                        "operator" => "<",
                        "nilai" => "potensi_kecil",
                    ],
                    ["batas" => "288", "operator" => "<=", "nilai" => "potensi_sedang",],
                    ["batas" => "288", "operator" => ">", "nilai" => "potensi_tinggi"]
                ],

            ),
            array(

                "nama" => "Luas Tanam (Ha)",
                "keterangan" => "Luas Tanam (Ha)",
                "attribut" => [
                    ["batas" => "150", "operator" => "<", "nilai" => "luas_rendah",],
                    ["batas" => "250", "operator" => "<=", "nilai" => "luas_sedang",],
                    ["batas" => "250", "operator" => ">", "nilai" => "luas_tinggi"]
                ],

            ),
            array(

                "nama" => "Jumlah Bibit Eucheuma Conttoni (Kg)",
                "keterangan" => "Jumlah Bibit Eucheuma Conttoni",
                "attribut" => [
                    ["batas" => "200", "operator" => "<", "nilai" => "conttoni_rendah",],
                    ["batas" => "478", "operator" => "<=", "nilai" => "conttoni_sedang",],
                    ["batas" => "478", "operator" => ">", "nilai" => "conttoni_tinggi"]
                ],

            ),
            array(

                "nama" => "Jumlah Bibit Eucheuma Spinosom (Kg)",
                "keterangan" => "Jumlah Bibit Eucheuma Spinosom (KG)",
                "attribut" => [
                    ["batas" => "100", "operator" => "<", "nilai" => "spinosom_rendah",],
                    ["batas" => "227", "operator" => "<=", "nilai" => "spinosom_sedang",],
                    ["batas" => "227", "operator" => ">", "nilai" => "spinosom_tinggi"]
                ],

            ),
            array(

                "nama" => "Jumlah Bentangan",
                "keterangan" => "jumlah Bentangan",
                "attribut" => [
                    ["batas" => "50", "operator" => "<", "nilai" => "bentangan_rendah"],
                    ["batas" => "150", "operator" => "<=", "nilai" => "bentangan_sedang"],
                    ["batas" => "150", "operator" => ">", "nilai" => "bentangan_tinggi"]
                ],

            ),
            array(

                "nama" => "Petani (RPT)",
                "keterangan" => "Petani (RPT)",
                "attribut" => [
                    ["batas" => "130", "operator" => "<", "nilai" => "petani_rendah"],
                    ["batas" => "237", "operator" => "<=", "nilai" => "petani_sedang"],
                    ["batas" => "237", "operator" => ">", "nilai" => "petani_tinggi"]
                ],

            ),
            array(

                "nama" => "Suhu Air (*C)",
                "keterangan" => "Suhu air",
                "attribut" => [
                    ["batas" => "25", "operator" => "<", "nilai" => "suhu_rendah"],
                    ["batas" => "29", "operator" => "<=", "nilai" => "suhu_sedang"],
                    ["batas" => "29", "operator" => ">", "nilai" => "suhu_tinggi"]
                ],

            ),
            array(

                "nama" => "Salinitasi Kadar Garam (Ppt)",
                "keterangan" => "Salinitasi Kadar Garam (Ppt)",
                "attribut" => [
                    ["batas" => "26", "operator" => "<", "nilai" => "salinitas_rendah"],
                    ["batas" => "33", "operator" => "<=", "nilai" => "salinitas_sedang"],
                    ["batas" => "33", "operator" => ">", "nilai" => "salinitas_tinggi"]
                ],
            ),
        );



        foreach($indikators as $value){
            Indikator::create([
                'nama' => $value['nama'],
                'keterangan' => $value['keterangan'],
                'attribut' => $value['attribut'],
            ]);
        }
    }
}
