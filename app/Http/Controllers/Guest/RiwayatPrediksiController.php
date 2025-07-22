<?php

namespace App\Http\Controllers\Guest;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\RiwayatPengguna;
use Illuminate\Support\Facades\App;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class RiwayatPrediksiController extends Controller
{
    public function index()
    {
        return Inertia::render("guest/riwayatPengguna/index", [
            "riwayatPengguna" => RiwayatPengguna::orderBy('id', 'desc')->where('user_id', '=', Auth::user()->id)->paginate(10),
        ]);
    }


    public function show(RiwayatPengguna $riwayatPengguna)
    {
        return Inertia::render("guest/riwayatPengguna/show", [
            "riwayatPengguna" => $riwayatPengguna,
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
            redirectRoute: 'user.riwayatPengguna.index'
        );
    }
}
