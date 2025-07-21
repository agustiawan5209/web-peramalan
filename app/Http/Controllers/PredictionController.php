<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Indikator;
use App\Models\HasilPanen;
use Illuminate\Http\Request;

class PredictionController extends Controller
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

                $data[] = intval($nilai);
            }
            $data[] = intval($item->total_panen);
            return $data;
        });
        $transactionY = $panen->map(function ($item) use ($kriteria) {
             $jenis = $item->jenisRumputLaut;
             $data = [];
             foreach ($jenis as $key => $value) {
                $data[$value['nama']] = $value['jumlah'];
             }
             return $data;
        });
        return Inertia::render('prediction/index', [
            'breadcrumb' => self::BASE_BREADCRUMS,
            'titlePage' => 'Prediksi Panen',
            'transactionX' => $transaction,
            'indikator'=> $kriteria,
            'transactionY'=> $transactionY,
        ]);
    }
}
