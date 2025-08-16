<?php

namespace App\Http\Controllers;

use App\Models\KriteriaTerpilih;
use Illuminate\Http\Request;

class KriteriaTerpilihController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'hasil' => 'required',
        ]);

        $kriteria = KriteriaTerpilih::create($request->all());

        return response()->json('Indikator Berhasil Disimpan', 200);
        //
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $kriteria = KriteriaTerpilih::latest()->first();

        return response()->json($kriteria, 200);
    }

}
