<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Requests that match no route (for example a missing image) have no
        // session. They can still reach the 404 page, so read it safely.
        $session = $request->hasSession() ? $request->session() : null;
        $user = $session ? $request->user() : null;

        return [
            ...parent::share($request),

            'appName' => config('app.name'),

            // Only the fields the UI needs, never the whole model.
            'auth' => [
                'user' => $user ? $user->only(['id', 'name', 'email']) : null,
                'roles' => $user ? $user->getRoleNames()->values() : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name')->values() : [],
            ],

            // Set by controllers with redirect()->with('success', ...) and by
            // Fortify (session "status"), shown as a toast in the layout.
            'flash' => [
                'success' => fn () => $session?->get('success'),
                'error' => fn () => $session?->get('error'),
                'status' => fn () => $session?->get('status'),
            ],
        ];
    }
}
