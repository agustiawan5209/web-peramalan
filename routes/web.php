<?php

use App\Http\Controllers\HasilPanenController;
use App\Http\Controllers\IndikatorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::group(['prefix' => 'admin', 'as'=> 'admin.'], function () {
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
                Route::get('/{hasilPanen}/edit', 'edit')->name('edit');
                Route::put('/{hasilPanen}', 'update')->name('update');
                Route::delete('/{hasilPanen}', 'destroy')->name('destroy');
            });
        });
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
