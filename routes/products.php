<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::name('products.')->prefix('product')->middleware('auth')->group(function () {
    Route::get('/products', [ProductController::class, 'index'])
        ->middleware('permission:view products')
        ->name('index');

    Route::get('/products/create', [ProductController::class, 'create'])
        ->middleware('permission:create products')
        ->name('create');

    Route::post('/products', [ProductController::class, 'store'])
        ->middleware('permission:create products')
        ->name('store');

    Route::get('/products/{product}', [ProductController::class, 'show'])
        ->middleware('permission:view products')
        ->name('show');

    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
        ->middleware('permission:edit products')
        ->name('edit');

    Route::put('/products/{product}', [ProductController::class, 'update'])
        ->middleware('permission:edit products')
        ->name('update');

    Route::delete('/products/{product}', [ProductController::class, 'destroy'])
        ->middleware('permission:delete products')
        ->name('destroy');
});
