<?php

namespace App\Providers;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Inertia\ExceptionResponse;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Low-stock alert: right after signing in, the dashboard shows a pop-up
        // listing products that are low or out of stock (flash = once per login).
        Event::listen(Login::class, function () {
            session()->flash('stock_alert', true);
        });

        // Show a React error page (inside the app layout) for "forbidden" and
        // "not found" instead of Laravel's plain HTML page. Spatie's role and
        // permission middleware throw a 403, so blocked users land here.
        // Server errors (500) keep Laravel's debug page while developing.
        Inertia::handleExceptionsUsing(function (ExceptionResponse $response) {
            if (in_array($response->statusCode(), [403, 404], true)) {
                return $response
                    ->render('Error', ['status' => $response->statusCode()])
                    ->withSharedData();
            }

            if ($response->statusCode() === 419) {
                return back()->with('error', 'Your session expired. Please try again.');
            }
        });
    }
}
