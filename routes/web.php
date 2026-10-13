<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public landing page.
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)
        ->middleware('permission:view dashboard')
        ->name('dashboard');

    // Forms on this page post to Fortify's /user/profile-information and /user/password.
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
});

require __DIR__.'/product-categories.php';
require __DIR__.'/products.php';
require __DIR__.'/suppliers.php';
require __DIR__.'/stock-movements.php';
require __DIR__.'/users.php';
