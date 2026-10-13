<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->validate(['search' => ['nullable', 'string', 'max:100']])['search'] ?? '';

        $categories = ProductCategory::query()
            ->withCount('products')
            ->withSum('products', 'stock')
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (ProductCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'products_count' => $category->products_count,
                'units' => (int) $category->products_sum_stock,
            ]);

        return Inertia::render('ProductCategories/Index', [
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('ProductCategories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:product_categories,name'],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $category = ProductCategory::create($validated);

        return redirect()
            ->route('product-categories.index')
            ->with('success', "Category \"{$category->name}\" created.");
    }

    /**
     * Display the specified resource and the products under it.
     */
    public function show(ProductCategory $productCategory): Response
    {
        $products = $productCategory->products()
            ->with('supplier:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'stock' => $product->stock,
                'stock_status' => $product->stock_status,
                'price' => $product->price,
                'supplier' => $product->supplier?->name,
            ]);

        return Inertia::render('ProductCategories/Show', [
            'category' => $productCategory->only(['id', 'name', 'description']),
            'products' => $products,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $productCategory): Response
    {
        return Inertia::render('ProductCategories/Edit', [
            'category' => $productCategory->only(['id', 'name', 'description']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductCategory $productCategory)
    {
        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('product_categories', 'name')->ignore($productCategory->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
        ]);

        $productCategory->update($validated);

        return redirect()
            ->route('product-categories.index')
            ->with('success', "Category \"{$productCategory->name}\" updated.");
    }

    /**
     * Remove the specified resource from storage.
     * The foreign key cascades, so deleting a category would silently delete
     * its products. Block it while products are still assigned.
     */
    public function destroy(ProductCategory $productCategory)
    {
        $count = $productCategory->products()->count();

        if ($count > 0) {
            return back()->with('error', "\"{$productCategory->name}\" still has {$count} product(s). Move or delete them first.");
        }

        $name = $productCategory->name;
        $productCategory->delete();

        return redirect()
            ->route('product-categories.index')
            ->with('success', "Category \"{$name}\" deleted.");
    }
}
