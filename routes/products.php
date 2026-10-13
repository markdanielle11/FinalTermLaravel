<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::name('products.')->prefix('product')->group(function () {
    Route::get('/products', [ProductController::class, 'index'])
    ->middleware('permission:view products')
    ->name('index');

    Route::get('/products/create', [ProductController::class, 'create'])
        ->name('create');

    Route::post('/products', [ProductController::class, 'store'])
        ->name('store');

    Route::get('/products/{product}', [ProductController::class, 'show'])
        ->name('show');

    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->name('edit');

    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->name('update');

    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->name('destroy');
});