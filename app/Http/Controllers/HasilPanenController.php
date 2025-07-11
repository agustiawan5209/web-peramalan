<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Indikator;
use App\Models\HasilPanen;
use Illuminate\Support\Facades\App;
use App\Http\Requests\StoreHasilPanenRequest;
use App\Http\Requests\UpdateHasilPanenRequest;

class HasilPanenController extends Controller
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
        $hasilPanen = HasilPanen::paginate(10);
        return Inertia::render("admin/hasilPanen/index", [
            "hasilPanen" => $hasilPanen,
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage' => 'Hasil Panen',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/hasilPanen/create', [
            'indikator'=> Indikator::all(),
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                ['title' => 'tambah', 'href' => '/admin/hasil-panen/create'],
            ]),
            'titlePage' => 'Tambah Hasil Panen',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHasilPanenRequest $request)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => HasilPanen::create($request->validated()),
            successMessage: 'Hasil Panen Berhasil Ditambahkan!',
            redirectRoute: 'admin.hasilpanen.index'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(HasilPanen $hasilPanen)
    {
        return Inertia::render('admin/hasilPanen/show', [
            'hasilPanen' => $hasilPanen,
            'indikator' => Indikator::all(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(HasilPanen $hasilPanen)
    {
         return Inertia::render('admin/hasilPanen/edit', [
            'hasilPanen' => $hasilPanen,
            'indikator' => Indikator::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHasilPanenRequest $request, HasilPanen $hasilPanen)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() =>$hasilPanen->update($request->validated()),
            successMessage: 'Hasil Panen Berhasil Diperbarui!',
            redirectRoute: 'admin.hasilpanen.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(HasilPanen $hasilPanen)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $hasilPanen->delete(),
            successMessage: 'Hasil Panen Berhasil Dihapus!',
            redirectRoute: 'admin.hasilpanen.index'
        );
    }
}
