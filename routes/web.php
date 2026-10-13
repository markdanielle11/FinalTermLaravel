<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/react-demo', function () {
    return Inertia::render('Welcome');
});

Route::middleware('auth')->group(function(){
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    });
});

require __DIR__ . '/product-categories.php';
require __DIR__ . '/products.php';