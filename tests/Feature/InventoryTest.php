<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InventoryTest extends TestCase
{
    use RefreshDatabase;

    private User $manager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->manager = User::role('Manager')->firstOrFail();
    }

    public function test_product_validation_errors_come_back_per_field(): void
    {
        $this->actingAs($this->manager)
            ->from('/product/products/create')
            ->post('/product/products', ['name' => '', 'price' => -1, 'sku' => 'TSH-001', 'stock' => 'abc'])
            ->assertRedirect('/product/products/create')
            ->assertSessionHasErrors(['name', 'price', 'sku', 'stock', 'product_category_id', 'low_stock_threshold']);
    }

    public function test_creating_a_product_records_opening_stock(): void
    {
        $category = ProductCategory::first();

        $this->actingAs($this->manager)->post('/product/products', [
            'product_category_id' => $category->id,
            'supplier_id' => Supplier::first()->id,
            'sku' => 'TSH-099',
            'name' => 'Pocket Tee',
            'price' => 349.5,
            'size' => 'L',
            'color' => 'Olive',
            'stock' => 12,
            'low_stock_threshold' => 4,
        ])->assertSessionHasNoErrors()->assertRedirect();

        $product = Product::where('sku', 'TSH-099')->firstOrFail();
        $this->assertSame(12, $product->stock);
        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id, 'type' => 'in', 'quantity' => 12, 'quantity_before' => 0, 'quantity_after' => 12,
        ]);
    }

    public function test_updating_a_product_does_not_change_stock(): void
    {
        $product = Product::first();

        $this->actingAs($this->manager)->put("/product/products/{$product->id}", [
            'product_category_id' => $product->product_category_id,
            'sku' => $product->sku,
            'name' => 'Renamed',
            'price' => 100,
            'low_stock_threshold' => 3,
            'stock' => 9999,
        ])->assertSessionHasNoErrors();

        $fresh = $product->fresh();
        $this->assertSame('Renamed', $fresh->name);
        $this->assertSame($product->stock, $fresh->stock);
    }

    public function test_stock_out_cannot_go_below_zero(): void
    {
        $product = Product::first();

        $this->actingAs($this->manager)->post('/stock/movements', [
            'product_id' => $product->id, 'type' => 'out', 'quantity' => $product->stock + 1,
        ])->assertSessionHasErrors('quantity');

        $this->assertSame($product->stock, $product->fresh()->stock);
    }

    public function test_stock_out_records_before_and_after(): void
    {
        $product = Product::where('stock', '>', 3)->first();

        $this->actingAs($this->manager)->post('/stock/movements', [
            'product_id' => $product->id, 'type' => 'out', 'quantity' => 3, 'note' => 'Sold',
        ])->assertSessionHasNoErrors()->assertSessionHas('success');

        $this->assertDatabaseHas('stock_movements', [
            'product_id' => $product->id, 'user_id' => $this->manager->id, 'type' => 'out',
            'quantity' => 3, 'quantity_before' => $product->stock, 'quantity_after' => $product->stock - 3,
        ]);
    }

    public function test_stock_out_that_reaches_the_threshold_raises_a_low_stock_warning(): void
    {
        $product = Product::where('sku', 'TSH-001')->firstOrFail(); // 44 in stock, alert at 10

        $this->actingAs($this->manager)->post('/stock/movements', [
            'product_id' => $product->id, 'type' => 'out', 'quantity' => 40,
        ])->assertSessionHas('warning');

        $this->actingAs($this->manager)->post('/stock/movements', [
            'product_id' => $product->id, 'type' => 'in', 'quantity' => 50,
        ])->assertSessionMissing('warning');
    }

    public function test_logging_in_flashes_the_stock_alert_for_the_dashboard(): void
    {
        $this->post('/login', ['email' => 'staff@example.com', 'password' => 'password'])
            ->assertRedirect('/dashboard')
            ->assertSessionHas('stock_alert', true);

        $this->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->where('flash.stock_alert', true)
            ->has('needsAttention', 5));
    }

    public function test_category_with_products_cannot_be_deleted(): void
    {
        $category = ProductCategory::has('products')->first();

        $this->actingAs($this->manager)->delete("/product-category/product-categories/{$category->id}")
            ->assertSessionHas('error');

        $this->assertModelExists($category);
    }

    public function test_deleting_a_supplier_keeps_its_products(): void
    {
        $supplier = Supplier::has('products')->first();
        $count = $supplier->products()->count();

        $this->actingAs($this->manager)->delete("/supplier/suppliers/{$supplier->id}")->assertSessionHas('success');

        $this->assertModelMissing($supplier);
        $this->assertSame($count, Product::whereNull('supplier_id')->count());
    }

    public function test_product_filters(): void
    {
        $this->actingAs($this->manager)->get('/product/products?status=out_of_stock')
            ->assertInertia(fn (Assert $page) => $page->has('products.data', 2)->where('filters.status', 'out_of_stock'));

        $this->actingAs($this->manager)->get('/product/products?search=jacket')
            ->assertInertia(fn (Assert $page) => $page->has('products.data', 3));
    }

    public function test_products_can_be_sorted_by_stock(): void
    {
        $this->actingAs($this->manager)->get('/product/products?sort=stock&direction=desc')
            ->assertInertia(fn (Assert $page) => $page
                ->where('products.data.0.name', 'Classic Cotton T-Shirt')
                ->where('filters.sort', 'stock'));

        $this->actingAs($this->manager)->get('/product/products?sort=password')->assertSessionHasErrors('sort');
    }

    public function test_admin_cannot_remove_own_admin_role_or_delete_self(): void
    {
        $admin = User::role('Admin')->firstOrFail();

        $this->actingAs($admin)->put("/admin/users/{$admin->id}", [
            'name' => $admin->name, 'email' => $admin->email, 'role' => 'Staff',
        ])->assertSessionHasErrors('role');

        $this->actingAs($admin)->delete("/admin/users/{$admin->id}")->assertSessionHas('error');
        $this->assertTrue($admin->fresh()->hasRole('Admin'));
    }

    public function test_admin_can_create_user_with_role(): void
    {
        $admin = User::role('Admin')->firstOrFail();

        $this->actingAs($admin)->post('/admin/users', [
            'name' => 'Paolo Reyes', 'email' => 'paolo@example.com', 'role' => 'Manager',
            'password' => 'password123', 'password_confirmation' => 'password123',
        ])->assertSessionHasNoErrors();

        $this->assertTrue(User::where('email', 'paolo@example.com')->first()->hasRole('Manager'));
    }

    public function test_profile_update_uses_fortify(): void
    {
        $this->actingAs($this->manager)->put('/user/profile-information', [
            'name' => 'Manager Updated', 'email' => $this->manager->email,
        ])->assertSessionHasNoErrors();

        $this->assertSame('Manager Updated', $this->manager->fresh()->name);
    }
}
