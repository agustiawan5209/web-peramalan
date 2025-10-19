<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FPGrowthController;
use App\Http\Controllers\IndikatorController;
use App\Http\Controllers\HasilPanenController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\Web\WebPageController;
use App\Http\Controllers\ModelStorageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\PredictionModelController;
use App\Http\Controllers\Guest\DashboardController as GuestDashboardController;
use App\Http\Controllers\Guest\RiwayatPrediksiController;
use App\Http\Controllers\KriteriaTerpilihController;
use App\Http\Controllers\RiwayatPenggunaController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role:admin|super_admin'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
        Route::group(['prefix' => 'indikator', 'as' => 'indikator.'], function () {
            Route::controller(IndikatorController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{indikator}/edit', 'edit')->name('edit');
                Route::put('/{indikator}', 'update')->name('update');
                Route::delete('/{indikator}', 'destroy')->name('destroy');
            });
        });


        Route::group(['prefix' => 'hasil-panen', 'as' => 'hasilPanen.'], function () {
            Route::controller(HasilPanenController::class)->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{hasilPanen}/show', 'show')->name('show');
                Route::get('/{hasilPanen}/edit', 'edit')->name('edit');
                Route::put('/{hasilPanen}', 'update')->name('update');
                Route::delete('/{hasilPanen}', 'destroy')->name('destroy');
            });
        });

        // Riwayat Pengguna
        Route::group(['prefix' => 'riwayat', 'as' => 'riwayatPengguna.'], function () {
            Route::get('/', [RiwayatPenggunaController::class, 'index'])->name('index');
            Route::get('/detail/{riwayatPengguna}', [RiwayatPenggunaController::class, 'show'])->name('show');
            Route::delete('/destroy/{riwayatPengguna}', [RiwayatPenggunaController::class, 'destroy'])->name('destroy');
        });
    });

    Route::group(['prefix' => 'fpgrowth', 'as' => 'fpgrowth.'], function () {
        Route::controller(FPGrowthController::class)->group(function () {
            Route::get('/', 'index')->name('index');
        });
    });
    Route::group(['prefix' => 'prediction', 'as' => 'prediction.'], function () {
        Route::controller(PredictionController::class)->group(function () {
            Route::get('/', 'index')->name('index');
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Router Pengguna
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::group(['as' => 'user.'], function () {

        Route::get('user/dashboard', [GuestDashboardController::class, 'dashboard'])->name('dashboard');

        Route::controller(WebPageController::class)->group(function () {
            Route::get('/form/prediksi', 'index')->name('form.prediksi');
        });

        // Riwayat Pengguna
        Route::group(['prefix' => 'user/riwayat', 'as' => 'riwayatPengguna.'], function () {
            Route::get('/', [RiwayatPrediksiController::class, 'index'])->name('index');
            Route::get('/detail/{riwayatPengguna}', [RiwayatPrediksiController::class, 'show'])->name('show');
            Route::delete('/destroy/{riwayatPengguna}', [RiwayatPrediksiController::class, 'destroy'])->name('destroy');
        });
    });
});



// routes/api.php
Route::prefix('models')->group(function () {
    Route::post('api/models/', [ModelStorageController::class, 'store'])->name('model.store');
    Route::get('api/models/{modelName}', [ModelStorageController::class, 'show'])->name('model.show');
});
Route::prefix('api/prediction')->group(function () {
    Route::post('/', [PredictionModelController::class, 'store'])->name('prediction.store');
    Route::get('/{modelName}', [PredictionModelController::class, 'show'])->name('prediction.show');
    Route::get('/transaction/data', [PredictionModelController::class, 'setTransactionAPI'])->name('prediction.setTransactionAPI');
});
Route::post('/riwayat/store', [RiwayatPenggunaController::class, 'store'])->name('riwayatPengguna.store')->middleware(['auth']);


//
/**
 * routes untuk menyimpan kriteria yang terpilih dari hasil
 * algoritma FP-growth
 * dan
 * menampilkan kriteria yang terpilih
 */


Route::post('/store/kriteria/model', [KriteriaTerpilihController::class, 'store'])->name('store.kriteria.model');
Route::get('/show/kriteria/model', [KriteriaTerpilihController::class, 'show'])->name('show.kriteria.model');

Route::get('/get/riwayat/pengguna', [RiwayatPenggunaController::class, 'getRiwayatPengguna'])->name('api.get.riwayat.pengguna')->middleware(['auth']);
