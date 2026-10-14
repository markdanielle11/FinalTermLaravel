<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Checks Fortify + Spatie wiring: who can open which page and who gets a 403.
 */
class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    private function user(string $role): User
    {
        return User::role($role)->firstOrFail();
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/product/products')->assertRedirect('/login');
        $this->get('/admin/users')->assertRedirect('/login');
    }

    public function test_public_and_auth_pages_render_react_components(): void
    {
        $this->get('/')->assertRedirect('/login');
        $this->get('/login')->assertInertia(fn (Assert $page) => $page->component('Auth/Login'));
        $this->get('/register')->assertInertia(fn (Assert $page) => $page->component('Auth/Register'));
        $this->get('/forgot-password')->assertInertia(fn (Assert $page) => $page->component('Auth/ForgotPassword'));
        $this->get('/reset-password/some-token?email=a@b.c')->assertInertia(
            fn (Assert $page) => $page->component('Auth/ResetPassword')->where('token', 'some-token')->where('email', 'a@b.c')
        );
    }

    public function test_unknown_urls_show_the_react_404_page(): void
    {
        $this->get('/this-page-does-not-exist')
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page->component('Error')->where('status', 404));

        $this->get('/images/missing.png')->assertNotFound();
    }

    public function test_registration_assigns_the_staff_role(): void
    {
        $this->post('/register', [
            'name' => 'Rhea Santos',
            'email' => 'rhea@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect('/dashboard');

        $this->assertTrue(User::where('email', 'rhea@example.com')->first()->hasRole('Staff'));
    }

    public function test_login_with_wrong_password_returns_an_email_error(): void
    {
        $this->from('/login')->post('/login', ['email' => 'admin@example.com', 'password' => 'wrong'])
            ->assertRedirect('/login')
            ->assertSessionHasErrors('email');
    }

    public function test_home_sends_signed_in_users_to_the_dashboard(): void
    {
        $this->actingAs($this->user('Staff'))->get('/')->assertRedirect('/dashboard');
    }

    public function test_admin_can_open_every_page(): void
    {
        $admin = $this->user('Admin');
        $product = Product::first();

        foreach ([
            '/dashboard' => 'Dashboard',
            '/profile' => 'Profile/Edit',
            '/product/products' => 'Products/Index',
            '/product/products/create' => 'Products/Create',
            "/product/products/{$product->id}" => 'Products/Show',
            "/product/products/{$product->id}/edit" => 'Products/Edit',
            '/product-category/product-categories' => 'ProductCategories/Index',
            '/product-category/product-categories/create' => 'ProductCategories/Create',
            "/product-category/product-categories/{$product->product_category_id}" => 'ProductCategories/Show',
            "/product-category/product-categories/{$product->product_category_id}/edit" => 'ProductCategories/Edit',
            '/supplier/suppliers' => 'Suppliers/Index',
            '/supplier/suppliers/create' => 'Suppliers/Create',
            "/supplier/suppliers/{$product->supplier_id}" => 'Suppliers/Show',
            "/supplier/suppliers/{$product->supplier_id}/edit" => 'Suppliers/Edit',
            '/stock/movements' => 'StockMovements/Index',
            '/admin/users' => 'Users/Index',
            '/admin/users/create' => 'Users/Create',
            "/admin/users/{$admin->id}" => 'Users/Show',
            "/admin/users/{$admin->id}/edit" => 'Users/Edit',
        ] as $url => $component) {
            $this->actingAs($admin)->get($url)
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page->component($component));
        }
    }

    public function test_manager_cannot_manage_users(): void
    {
        $this->actingAs($this->user('Manager'))->get('/admin/users')
            ->assertForbidden()
            ->assertInertia(fn (Assert $page) => $page->component('Error')->where('status', 403));

        $this->actingAs($this->user('Manager'))->get('/product/products/create')->assertOk();
    }

    public function test_staff_can_view_and_adjust_stock_but_not_edit_catalog(): void
    {
        $staff = $this->user('Staff');
        $product = Product::first();

        $this->actingAs($staff)->get('/product/products')->assertOk();
        $this->actingAs($staff)->get('/product/products/create')->assertForbidden();
        $this->actingAs($staff)->get("/product/products/{$product->id}/edit")->assertForbidden();
        $this->actingAs($staff)->delete("/product/products/{$product->id}")->assertForbidden();
        $this->actingAs($staff)->get('/product-category/product-categories/create')->assertForbidden();
        $this->actingAs($staff)->post('/supplier/suppliers', ['name' => 'X'])->assertForbidden();
        $this->actingAs($staff)->get('/admin/users')->assertForbidden();

        $this->actingAs($staff)->post('/stock/movements', [
            'product_id' => $product->id, 'type' => 'in', 'quantity' => 5,
        ])->assertSessionHasNoErrors();

        $this->assertSame($product->stock + 5, $product->fresh()->stock);
    }

    public function test_shared_props_expose_roles_and_permissions(): void
    {
        $this->actingAs($this->user('Staff'))->get('/dashboard')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.email', 'staff@example.com')
                ->where('auth.roles', ['Staff'])
                ->has('auth.permissions', 6)
                ->missing('auth.user.password'));
    }
}
