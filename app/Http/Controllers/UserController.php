<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

/**
 * User management. The whole route group is limited to role:Admin.
 */
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', 'string', 'exists:roles,name'],
        ]);

        $users = User::query()
            ->with('roles:id,name')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, $role) => $query->role($role))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user) => $this->present($user));

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $this->roleNames(),
            'filters' => [
                'search' => $filters['search'] ?? '',
                'role' => $filters['role'] ?? '',
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Users/Create', ['roles' => $this->roleNames()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'password' => ['required', 'string', Password::default(), 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // hashed by the "hashed" cast
        ]);

        $user->assignRole($validated['role']);

        return redirect()
            ->route('users.index')
            ->with('success', "User \"{$user->name}\" created as {$validated['role']}.");
    }

    /**
     * Display the specified resource with what their role allows.
     */
    public function show(User $user): Response
    {
        $user->load('roles:id,name');

        return Inertia::render('Users/Show', [
            'user' => [
                ...$this->present($user),
                'permissions' => $user->getAllPermissions()->pluck('name')->sort()->values(),
                'movements_count' => $user->stockMovements()->count(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response
    {
        $user->load('roles:id,name');

        return Inertia::render('Users/Edit', [
            'user' => $this->present($user),
            'roles' => $this->roleNames(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Password is optional here; leave blank to keep the current one.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', 'string', 'exists:roles,name'],
            'password' => ['nullable', 'string', Password::default(), 'confirmed'],
        ]);

        // An Admin removing their own Admin role would lock themselves out of this page.
        if ($user->is($request->user()) && $validated['role'] !== 'Admin') {
            return back()->withErrors(['role' => 'You cannot remove the Admin role from your own account.']);
        }

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        $user->save();
        $user->syncRoles([$validated['role']]);

        return redirect()
            ->route('users.index')
            ->with('success', "User \"{$user->name}\" updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->is($request->user())) {
            return back()->with('error', 'You cannot delete your own account here.');
        }

        $name = $user->name;
        $user->delete();

        return redirect()
            ->route('users.index')
            ->with('success', "User \"{$name}\" deleted.");
    }

    private function present(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->first()?->name,
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }

    private function roleNames()
    {
        // Fixed order: highest access first.
        return Role::query()
            ->orderByRaw("CASE name WHEN 'Admin' THEN 1 WHEN 'Manager' THEN 2 ELSE 3 END")
            ->pluck('name');
    }
}
