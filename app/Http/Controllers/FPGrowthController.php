<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\HasilPanen;
use App\Models\Indikator;
use Illuminate\Http\Request;

class FPGrowthController extends Controller
{
    private const BASE_BREADCRUMS = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'prediksi',
            'href' => '/prediction'
        ]
    ];
    public function index(Request $request)
    {
        $panen = HasilPanen::all();
        $kriteria = Indikator::select('id')->orderBy('id', 'asc')->pluck('id')->toArray();

        $transaction = $panen->map(function ($item) use ($kriteria) {
            $parameter = json_decode($item->parameter, true);
            $jenis = json_decode($item->jenisRumputLaut, true);
            // dd($parameter);
            $data = [];
            foreach ($kriteria as $key => $value) {
                $pm = array_values(array_filter($parameter, function ($pm) use ($value) {
                    return $pm['indikator_id'] == $value;
                }))[0]['nilai'];
                $data[$value] = $pm;
            }

            return array_values($data);
        });
        return Inertia::render('fpgrowth/index', [
            'breadcrumb' => self::BASE_BREADCRUMS,
            'titlePage' => 'Fp-growth Panen',
            'transaksiPanen' => $transaction,
        ]);
    }

    private function bin_panjang_garis_pantai($panjang): string
    {
        if ($panjang < 8) {
            return "Panjang_Rendah";
        } elseif ($panjang <= 11) {
            return "Panjang_Sedang";
        } else {
            return "Panjang_Tinggi";
        }
    }

    private function bin_petani_rumput_laut($petani): string
    {
        if ($petani < 45) {
            return "Petani_Rendah";
        } elseif ($petani <= 55) {
            return "Petani_Sedang";
        } else {
            return "Petani_Tinggi";
        }
    }

    private function bin_potensi_luas_lahan($potensi): string
    {
        if ($potensi < 140) {
            return "potensi_Rendah";
        } elseif ($potensi <= 160) {
            return "potensi_Sedang";
        } else {
            return "potensi_Tinggi";
        }
    }

    private function luas_tanam($luas): string
    {
        if ($luas < 120) {
            return "luas_Rendah";
        } elseif ($luas <= 140) {
            return "luas_Sedang";
        } else {
            return "luas_Tinggi";
        }
    }

    private function bin_jumlah_bentangan($jumlah): string
    {
        if ($jumlah < 360) {
            return "jumlah_sedikit";
        } elseif ($jumlah <= 400) {
            return "jumlah_Sedang";
        } else {
            return "jumlah_banyak";
        }
    }
    private function bin_jumlah_bibit($jumlah): string
    {
        if ($jumlah < 2800) {
            return "jumlah_sedikit";
        } elseif ($jumlah <= 3000) {
            return "jumlah_Sedang";
        } else {
            return "jumlah_banyak";
        }
    }

    private function bin_suhu($suhu): string
    {
        if ($suhu < 28) {
            return "Suhu_Rendah";
        } elseif ($suhu <= 30) {
            return "Suhu_Sedang";
        } else {
            return "Suhu_Tinggi";
        }
    }

    private function bin_ph($ph): string
    {
        if ($ph < 7.5) {
            return "pH_Asam";
        } elseif ($ph <= 8.2) {
            return "pH_Netral";
        } else {
            return "pH_Basa";
        }
    }

    private function bin_salinitas($sal): string
    {
        if ($sal < 31) {
            return "Salinitas_Rendah";
        } elseif ($sal <= 33) {
            return "Salinitas_Sedang";
        } else {
            return "Salinitas_Tinggi";
        }
    }

    private function bin_panen($panen): string
    {
        if ($panen < 2000) {
            return "Panen_Rendah";
        } elseif ($panen <= 2600) {
            return "Panen_Sedang";
        } else {
            return "Panen_Tinggi";
        }
    }
    private function bin_kejernian($kejernian): string
    {
        if ($kejernian < 6) {
            return "kejernian_Rendah";
        } elseif ($kejernian <= 7) {
            return "kejernian_Sedang";
        } else {
            return "kejernian_Tinggi";
        }
    }
    private function bin_cahaya($cahaya): string
    {
        if ($cahaya < 7) {
            return "cahaya_Rendah";
        } elseif ($cahaya <= 8) {
            return "cahaya_Sedang";
        } else {
            return "cahaya_Tinggi";
        }
    }

    private function bin_kedalaman_air($kedalaman): string
    {
        if ($kedalaman < 1.1) {
            return "kedalaman_Rendah";
        } elseif ($kedalaman <= 1.2) {
            return "kedalaman_Sedang";
        } else {
            return "kedalaman_Tinggi";
        }
    }

    private function bin_ketersediaan_nutrigen($nutrigen): string
    {
        if ($nutrigen < 0.7) {
            return "nutrigen_Rendah";
        } elseif ($nutrigen <= 0.8) {
            return "nutrigen_Sedang";
        } else {
            return "nutrigen_Tinggi";
        }
    }
    private function bin_arus_air($arus): string
    {
        if ($arus < 0.3) {
            return "arus_Rendah";
        } elseif ($arus <= 0.4) {
            return "arus_Sedang";
        } else {
            return "arus_Tinggi";
        }
    }
}
