<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::name('suppliers.')->prefix('supplier')->middleware('auth')->group(function () {
    Route::get('/suppliers', [SupplierController::class, 'index'])
        ->middleware('permission:view suppliers')
        ->name('index');

    Route::get('/suppliers/create', [SupplierController::class, 'create'])
        ->middleware('permission:create suppliers')
        ->name('create');

    Route::post('/suppliers', [SupplierController::class, 'store'])
        ->middleware('permission:create suppliers')
        ->name('store');

    Route::get('/suppliers/{supplier}', [SupplierController::class, 'show'])
        ->middleware('permission:view suppliers')
        ->name('show');

    Route::get('/suppliers/{supplier}/edit', [SupplierController::class, 'edit'])
        ->middleware('permission:edit suppliers')
        ->name('edit');

    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])
        ->middleware('permission:edit suppliers')
        ->name('update');

    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])
        ->middleware('permission:delete suppliers')
        ->name('destroy');
});
