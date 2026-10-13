<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Only renders the page. The forms submit to Fortify's own endpoints:
 * PUT /user/profile-information and PUT /user/password.
 */
class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'roles' => $request->user()->getRoleNames(),
        ]);
    }
}
