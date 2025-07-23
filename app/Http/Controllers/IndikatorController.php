<?php

namespace App\Http\Controllers;

use App\Models\Tags;
use Inertia\Inertia;
use App\Models\Indikator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreIndikatorRequest;
use App\Http\Requests\UpdateIndikatorRequest;

class IndikatorController extends Controller
{
    private const BASE_BREADCRUMB = [
        [
            'title' => 'dashboard',
            'href' => '/dashboard',
        ],
        [
            'title' => 'indikator',
            'href' => '/admin/indikator/',
        ],
    ];
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        return Inertia::render("admin/indikator/index", [
            'indikator' => Indikator::all(),
            'breadcrumb' => self::BASE_BREADCRUMB,
            'titlePage'=> 'Indikator',
            'can'=>[
                'add'=> $user->can('add indikator'),
                'edit'=> $user->can('edit indikator'),
                'read'=> $user->can('read indikator'),
                'delete'=> $user->can('delete indikator'),
            ]
        ]);
    }
 private function applyFilters($query, Request $request): void
    {
        if ($request->filled('q')) {
            $query->searchByName($request->input('q'));
        }
        if ($request->filled('category')) {
            $query->searchByCategory($request->input('category'));
        }

        if (in_array($request->input('order_by'), ['asc', 'desc'])) {
            $query->orderBy('created_at', $request->input('order_by'));
        } elseif (in_array($request->input('order_by'), ['A-Z', 'Z-A'])) {
            $direction = $request->input('order_by') === 'A-Z' ? 'asc' : 'desc';
            $query->orderBy('name', $direction);
        }

        $sortField = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/indikator/create', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'tambah kategori',
                    'href' => '/admin/kategori/create',
                ]
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreIndikatorRequest $request): \Illuminate\Http\RedirectResponse
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => Indikator::create([
                'nama' => $request->nama,
                'keterangan' => $request->keterangan,
                'attribut'=> $request->attribut,
            ]),
            successMessage: 'Kategori Berhasil Ditambahkan!',
            redirectRoute: 'admin.indikator.index'
        );
    }


    /**
     * Display the specified resource.
     */
    public function show(Indikator $indikator)
    {
        return Inertia::render('admin/indikator/show', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'detail kategori',
                    'href' => '/admin/kategori/detail',
                ]
            ]),
            'indikator' => $indikator,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Indikator $indikator)
    {
        return Inertia::render('admin/indikator/edit', [
            'breadcrumb' => array_merge(self::BASE_BREADCRUMB, [
                [
                    'title' => 'edit kategori',
                    'href' => '/admin/kategori/edit',
                ]
            ]),
            'indikator' => $indikator
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateIndikatorRequest $request, Indikator $indikator)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $indikator->update([
                'nama'=> $request->nama,
                'keterangan'=> $request->keterangan,
                'attribut'=> $request->attribut,
            ]),
            successMessage: 'Kategori Berhasil Di Update!',
            redirectRoute: 'admin.indikator.index'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Indikator $indikator)
    {
        $databaseHelper = App::make('databaseHelper');
        return $databaseHelper(
            operation: fn() => $indikator->delete(),
            successMessage: 'Kategori Berhasil Di Hapus!',
            redirectRoute: 'admin.indikator.index'
        );
    }
}
