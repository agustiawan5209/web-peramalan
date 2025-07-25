<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Indikator;
use App\Models\HasilPanen;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $user = Auth::user();

        if ($user === null || !$user->hasRole(['admin', 'super_admin'])) {
            auth()->logout();

            return redirect()->route('home');
        }
    }
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
