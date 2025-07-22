<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use App\Models\Indikator;
use App\Models\HasilPanen;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public const BASE_JENISRUMPUT_LAUT = [
        'conttoniBasah',
        'conttoniKering',
        'spinosumBasah',
        'spinosumKering',
    ];
    public function dashboard()
    {

        $panen = HasilPanen::all();
        $kriteria = Indikator::orderBy('id', 'asc')->get();

        $transactionY = $panen->map(function ($item) use ($kriteria) {
            $jenis = $item->jenisRumputLaut;
            $data = [];
            foreach ($jenis as $key => $value) {
                $data[$value['nama']] = $value['jumlah'];
            }
            return $data;
        });
        return Inertia::render('guest/dashboard', [
            'baseJenisRumputLaut' => self::BASE_JENISRUMPUT_LAUT,
            'totalDataPanen' => HasilPanen::all()->count(),
            'indikator' => Indikator::all()->count(),
            'transactionY' => $transactionY,

        ]);
    }
}
