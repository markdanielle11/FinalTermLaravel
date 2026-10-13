<?php

use App\Http\Controllers\StockMovementController;
use Illuminate\Support\Facades\Route;

Route::name('stock-movements.')->prefix('stock')->middleware('auth')->group(function () {
    Route::get('/movements', [StockMovementController::class, 'index'])
        ->middleware('permission:view stock movements')
        ->name('index');

    Route::post('/movements', [StockMovementController::class, 'store'])
        ->middleware('permission:adjust stock')
        ->name('store');
});
