<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\StockMovement;
use App\Models\Supplier;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * KPIs, items that need restocking, and the latest stock activity.
     */
    public function __invoke(): Response
    {
        $needsAttention = Product::query()
            ->with('category:id,name')
            ->whereColumn('stock', '<=', 'low_stock_threshold')
            ->orderBy('stock')
            ->orderBy('name')
            ->limit(8)
            ->get()
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'stock' => $product->stock,
                'low_stock_threshold' => $product->low_stock_threshold,
                'stock_status' => $product->stock_status,
                'category' => $product->category?->name,
            ]);

        $recentMovements = StockMovement::query()
            ->with(['product:id,name', 'user:id,name'])
            ->latest()
            ->latest('id')
            ->limit(8)
            ->get()
            ->map(fn (StockMovement $movement) => [
                'id' => $movement->id,
                'type' => $movement->type,
                'quantity' => $movement->quantity,
                'product' => $movement->product?->only(['id', 'name']),
                'user' => $movement->user?->name,
                'created_at' => $movement->created_at->toIso8601String(),
            ]);

        $categories = ProductCategory::query()
            ->withCount('products')
            ->withSum('products', 'stock')
            ->orderBy('name')
            ->get()
            ->map(fn (ProductCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'products_count' => $category->products_count,
                'units' => (int) $category->products_sum_stock,
            ]);

        return Inertia::render('Dashboard', [
            'stats' => [
                'products' => Product::count(),
                'units' => (int) Product::sum('stock'),
                'stock_value' => (float) Product::query()->selectRaw('COALESCE(SUM(price * stock), 0) as total')->value('total'),
                'suppliers' => Supplier::count(),
                'low_stock' => Product::lowStock()->count(),
                'out_of_stock' => Product::outOfStock()->count(),
            ],
            'needsAttention' => $needsAttention,
            'recentMovements' => $recentMovements,
            'categories' => $categories,
        ]);
    }
}
