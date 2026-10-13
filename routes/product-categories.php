<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductCategoryController;

Route::name('product-categories.')->prefix('product-category')->middleware('auth')->group(function () {
    Route::get('/product-categories', [ProductCategoryController::class, 'index'])
        ->name('index');

    Route::get('/product-categories/create', [ProductCategoryController::class, 'create'])
        ->name('create');

    Route::post('/product-categories', [ProductCategoryController::class, 'store'])
        ->name('store');

    Route::get('/product-categories/{productCategory}', [ProductCategoryController::class, 'show'])
        ->name('show');

    Route::get('/product-categories/{productCategory}/edit', [ProductCategoryController::class, 'edit'])
        ->name('edit');

    Route::put('/product-categories/{productCategory}', [ProductCategoryController::class, 'update'])
        ->name('update');

    Route::delete('/product-categories/{productCategory}', [ProductCategoryController::class, 'destroy'])
        ->name('destroy');
});