<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\StockMovement;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Demo data carried over from the 1st term "Apparel Inventory" system
 * (database.sql): same 3 suppliers and 18 products, with the old
 * category text normalized into the product_categories table.
 */
class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'T-Shirts' => ['TSH', 'Short-sleeve and casual tops.'],
            'Jeans' => ['JNS', 'Denim pants in different cuts.'],
            'Dresses' => ['DRS', 'Casual, party, and summer dresses.'],
            'Jackets' => ['JKT', 'Outerwear for cold or rainy days.'],
            'Activewear' => ['ACT', 'Sports and gym clothing.'],
            'Accessories' => ['ACC', 'Belts, bags, eyewear, and other add-ons.'],
        ];

        $categoryIds = [];
        foreach ($categories as $name => [, $description]) {
            $categoryIds[$name] = ProductCategory::create([
                'name' => $name,
                'description' => $description,
            ])->id;
        }

        $suppliers = [
            1 => ['Fashion Forward Inc.', '09171234567', 'fashion@email.com'],
            2 => ['Style Hub Distributors', '09281234567', 'stylehub@email.com'],
            3 => ['Urban Wear Supply', '09381234567', 'urbanwear@email.com'],
        ];

        $supplierIds = [];
        foreach ($suppliers as $oldId => [$name, $number, $email]) {
            $supplierIds[$oldId] = Supplier::create([
                'name' => $name,
                'contact_number' => $number,
                'email' => $email,
            ])->id;
        }

        // [name, category, old supplier_id, quantity, low_stock_threshold, price, size, color]
        $products = [
            ['Classic Cotton T-Shirt', 'T-Shirts', 1, 50, 10, 299.00, 'M', 'White'],
            ['V-Neck Casual Top', 'T-Shirts', 1, 35, 10, 349.00, 'L', 'Black'],
            ['Graphic Print Tee', 'T-Shirts', 2, 20, 10, 399.00, 'S', 'Navy Blue'],
            ['Slim Fit Jeans', 'Jeans', 2, 25, 8, 899.00, '32', 'Blue'],
            ['Straight Cut Denim', 'Jeans', 1, 15, 8, 999.00, '34', 'Dark Wash'],
            ['Ripped Skinny Jeans', 'Jeans', 3, 10, 8, 1099.00, '30', 'Black'],
            ['Floral Summer Dress', 'Dresses', 3, 12, 5, 1299.00, 'M', 'Pink'],
            ['Bodycon Party Dress', 'Dresses', 2, 8, 5, 1499.00, 'S', 'Red'],
            ['Maxi Boho Dress', 'Dresses', 1, 7, 5, 1599.00, 'L', 'Cream'],
            ['Denim Jacket', 'Jackets', 3, 15, 5, 1899.00, 'L', 'Blue'],
            ['Puffer Jacket', 'Jackets', 2, 8, 5, 2199.00, 'M', 'Black'],
            ['Leather Moto Jacket', 'Jackets', 1, 5, 5, 2499.00, 'XL', 'Brown'],
            ['Sports Leggings', 'Activewear', 3, 30, 10, 599.00, 'M', 'Black'],
            ['Training Tank Top', 'Activewear', 2, 25, 10, 449.00, 'S', 'White'],
            ['Hoodie Sweatshirt', 'Activewear', 1, 18, 10, 799.00, 'L', 'Gray'],
            ['Leather Belt', 'Accessories', 1, 40, 10, 399.00, null, 'Brown'],
            ['Canvas Tote Bag', 'Accessories', 2, 25, 10, 599.00, null, 'Beige'],
            ['Sunglasses', 'Accessories', 3, 20, 10, 899.00, null, 'Black'],
        ];

        $admin = User::where('email', 'admin@example.com')->first();
        $staff = User::where('email', 'staff@example.com')->first();

        // Some products were sold after the initial delivery so the history
        // shows both movement types and the dashboard has low/out of stock
        // items to display. Keys are product names, values are units sold.
        $demoSales = [
            'Classic Cotton T-Shirt' => 6,
            'Ripped Skinny Jeans' => 10,
            'Bodycon Party Dress' => 4,
            'Maxi Boho Dress' => 7,
            'Puffer Jacket' => 5,
            'Leather Moto Jacket' => 3,
        ];

        $counters = [];
        $daysAgo = 14;

        foreach ($products as [$name, $category, $oldSupplierId, $quantity, $threshold, $price, $size, $color]) {
            $prefix = $categories[$category][0];
            $counters[$prefix] = ($counters[$prefix] ?? 0) + 1;

            // The old system's quantity is what was received; sales come after.
            $received = $quantity;
            $sold = min($demoSales[$name] ?? 0, $received);

            $product = Product::create([
                'product_category_id' => $categoryIds[$category],
                'supplier_id' => $supplierIds[$oldSupplierId],
                'sku' => sprintf('%s-%03d', $prefix, $counters[$prefix]),
                'name' => $name,
                'price' => $price,
                'size' => $size,
                'color' => $color,
                'stock' => $received - $sold,
                'low_stock_threshold' => $threshold,
            ]);

            $receivedAt = now()->subDays($daysAgo)->setTime(9, 0);

            $this->movement($product, $admin, 'in', $received, 0, 'Initial stock from 1st term system', $receivedAt);

            if ($sold > 0) {
                $this->movement($product, $staff, 'out', $sold, $received, 'Sold to walk-in customer', now()->subDays(max($daysAgo - 5, 0))->setTime(15, 30));
            }

            $daysAgo = max($daysAgo - 1, 1);
        }
    }

    private function movement(Product $product, ?User $user, string $type, int $quantity, int $before, string $note, $at): void
    {
        $after = $type === 'in' ? $before + $quantity : $before - $quantity;

        $movement = new StockMovement([
            'product_id' => $product->id,
            'user_id' => $user?->id,
            'type' => $type,
            'quantity' => $quantity,
            'quantity_before' => $before,
            'quantity_after' => $after,
            'note' => $note,
        ]);

        $movement->created_at = $at;
        $movement->updated_at = $at;
        $movement->save();
    }
}
