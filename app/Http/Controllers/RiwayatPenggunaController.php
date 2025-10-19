<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RiwayatPengguna;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class RiwayatPenggunaController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'hasil panen',
            'href' => '/admin/hasil-panen/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("admin/riwayatPengguna/index", [
            "riwayatPengguna" => RiwayatPengguna::where('user_id', '!=', Auth::user()->id)->paginate(10),
            'breadcrumb' => self::BASE_BREADCRUMB,
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "model" => "required",
            "parameter" => "required",
        ]);
        RiwayatPengguna::create([
            "user_id" => Auth::user()->id,
            "user" => Auth::user(),
            "model" => $request->model,
            "parameter" => $request->parameter,
        ]);

        return response()->json("Berhasil", 200);
    }

    public function show(RiwayatPengguna $riwayatPengguna)
    {
        return Inertia::render("admin/riwayatPengguna/show", [
            "riwayatPengguna" => $riwayatPengguna,
            'breadcrumb' => self::BASE_BREADCRUMB,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RiwayatPengguna $riwayatPengguna)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $riwayatPengguna->delete(),
            successMessage: 'Riwayat Berhasil Di Hapus!',
            redirectRoute: 'admin.riwayatPengguna.index'
        );
    }

    public function getRiwayatPengguna(Request $request)
    {
        $riwayatPengguna = RiwayatPengguna::where('user_id', $request->userId)
            ->latest()->first();

        return response()->json($riwayatPengguna->model, 200);
    }
}
