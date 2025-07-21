<?php

namespace App\Http\Controllers;

use App\Models\HasilPanen;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        $transaction = $panen->map(function ($item) {
            $tr = json_decode($item->parameter, true);
            $rumputlaut = json_decode($item->jenisRumputLaut, true);
            $eucheuma_conttoni = array_values(array_filter($rumputlaut, function ($value) {
                return $value['nama'] === 'eucheuma_conttoni';
            }, 0))[0] ?? ['jumlah' => 0];
            $eucheuma_spinosum = array_values(array_filter($rumputlaut, function ($value) {
                return $value['nama'] === 'eucheuma_spinosum';
            }, 1))[0] ?? ['jumlah' => 0];
            $data = [
                'panjangGarisPantai' => $tr['panjangGarisPantai'],
                'jumlahPetani' => $tr['jumlahPetani'],
                'luasPotensi' => $tr['luasPotensi'],
                'luasTanam' => $tr['luasTanam'],
                'jumlahTali' => $tr['jumlahTali'],
                'jumlahBibit' => $tr['jumlahBibit'],
                'suhuAir' => $tr['suhuAir'],
                'pHAir' => $tr['pHAir'],
                'salinitas' => $tr['salinitas'],
                'kejernihanAir' => $tr['kejernihanAir'],
                'cahayaMatahari' => $tr['cahayaMatahari'],
                'kedalamanAir' => $tr['kedalamanAir'],
                'ketersediaanNutrisi' => $tr['ketersediaanNutrisi'],
                'arusAir' => $tr['arusAir'],
                'eucheuma_conttoni' => $eucheuma_conttoni['jumlah'],
                'eucheuma_spinosum' => $eucheuma_spinosum['jumlah'],
            ];

            return $data;
        });
        return Inertia::render('prediction/index', [
            'breadcrumb' => self::BASE_BREADCRUMS,
            'titlePage' => 'Prediksi Panen',
            'transaction' => $transaction,
        ]);
    }
}
