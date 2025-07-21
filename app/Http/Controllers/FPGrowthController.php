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
            $parameter = json_decode($item->parameter, true);
            $jenis = json_decode($item->jenisRumputLaut, true);
            // dd($parameter);
            $data = [];
            foreach ($kriteria as $key => $value) {
                $id = $value->id;
                $pm = array_values(array_filter($parameter, function ($pm) use ($id) {
                    return $pm['indikator_id'] == $id;
                }))[0]['nilai'];
                $data[$id] = $pm;
            }

            return array_values($data);
        });
        // dd($transaction);
        return Inertia::render('fpgrowth/index', [
            'breadcrumb' => self::BASE_BREADCRUMS,
            'titlePage' => 'Fp-growth Panen',
            'transaksiPanen' => $transaction,
        ]);
    }

    public function getRules($kriteria){
        $rules = [];
    }
}
