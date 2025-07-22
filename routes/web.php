<?php

use App\Http\Controllers\Admin\DashboardController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FPGrowthController;
use App\Http\Controllers\IndikatorController;
use App\Http\Controllers\HasilPanenController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\ModelStorageController;
use App\Http\Controllers\PredictionModelController;
use App\Http\Controllers\Web\WebPageController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
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
// routes/api.php
Route::prefix('models')->group(function () {
    Route::post('api/models/', [ModelStorageController::class, 'store'])->name('model.store');
    Route::get('api/models/{modelName}', [ModelStorageController::class, 'show'])->name('model.show');
});
Route::prefix('api/prediction')->group(function () {
    Route::post('/', [PredictionModelController::class, 'store'])->name('prediction.store');
    Route::get('/{modelName}', [PredictionModelController::class, 'show'])->name('prediction.show');
});


//
Route::group(['as' => 'user.'], function () {
    Route::controller(WebPageController::class)->group(function () {
        Route::get('/form/prediksi', 'index')->name('form.prediksi');
    });
});
