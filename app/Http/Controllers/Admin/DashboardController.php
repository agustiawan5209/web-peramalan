<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HasilPanen;
use App\Models\Indikator;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('dashboard', [
            'baseJenisRumputLaut' => self::BASE_JENISRUMPUT_LAUT,
            'totalDataPanen' => HasilPanen::all()->count(),
            'indikator' => Indikator::all()->count(),
            'transactionY' => $transactionY,

        ]);
    }
}
