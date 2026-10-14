<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// No public landing page: an inventory system opens straight to the login
// screen, or to the dashboard when the user is already signed in.
Route::get('/', function () {
    return redirect()->route(Auth::check() ? 'dashboard' : 'login');
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
