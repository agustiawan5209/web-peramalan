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
        $kriteria = Indikator::orderBy('id', 'asc')->get();

        $transaction = $panen->map(function ($item) use ($kriteria) {
            $parameter = $item->parameter;
            $jenis = $item->jenisRumputLaut;
            // dd($parameter);
            $data = [];
            foreach ($kriteria as $key => $value) {
                $id = $value->id;
                $nilai = array_values(array_filter($parameter, function ($pm) use ($id) {
                    return $pm['indikator_id'] == $id;
                }))[0]['nilai'];

                $rules = $this->getRules($value->attribut, $nilai);

                $data[$id] = $rules;
            }
            $data[] = $this->bin_panen(intval($item->total_panen));
            return array_values($data);
        });
        // dd($transaction);
        return Inertia::render('fpgrowth/index', [
            'breadcrumb' => self::BASE_BREADCRUMS,
            'titlePage' => 'Fp-growth Panen',
            'transaksiPanen' => $transaction,
        ]);
    }

    public function bin_panen($value){
        if($value < 600000){
            return 'hasil_panen_rendah';
        } elseif ($value <= 1000000) {
            return 'hasil_panen_sedang';
        } else{
            return 'hasil_panen_tinggi';
        }
    }

  public function getRules($rules, $value){
    foreach ($rules as $item) {
        $nilai = $item['nilai'];
        $batas = $item['batas'];
        $operator = $item['operator'];

        if ($operator == '<' && intval($value) < intval($batas)) {
            return $nilai;
        } elseif ($operator == '<=' && intval($value) <= intval($batas)) {
            return $nilai;
        } elseif ($operator == '>' && intval($value) > intval($batas)) {
            return $nilai;
        }
    }
    return 0; // Tidak ada kondisi yang sesuai
}

}
