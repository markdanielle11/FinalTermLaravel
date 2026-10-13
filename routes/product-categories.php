<?php

use App\Http\Controllers\ProductCategoryController;
use Illuminate\Support\Facades\Route;

Route::name('product-categories.')->prefix('product-category')->middleware('auth')->group(function () {
    Route::get('/product-categories', [ProductCategoryController::class, 'index'])
        ->middleware('permission:view categories')
        ->name('index');

    Route::get('/product-categories/create', [ProductCategoryController::class, 'create'])
        ->middleware('permission:create categories')
        ->name('create');

    Route::post('/product-categories', [ProductCategoryController::class, 'store'])
        ->middleware('permission:create categories')
        ->name('store');

    Route::get('/product-categories/{productCategory}', [ProductCategoryController::class, 'show'])
        ->middleware('permission:view categories')
        ->name('show');

    Route::get('/product-categories/{productCategory}/edit', [ProductCategoryController::class, 'edit'])
        ->middleware('permission:edit categories')
        ->name('edit');

    Route::put('/product-categories/{productCategory}', [ProductCategoryController::class, 'update'])
        ->middleware('permission:edit categories')
        ->name('update');

    Route::delete('/product-categories/{productCategory}', [ProductCategoryController::class, 'destroy'])
        ->middleware('permission:delete categories')
        ->name('destroy');
});
