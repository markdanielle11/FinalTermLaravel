<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     * Supports search, category/supplier/status filters, and pagination.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'integer', 'exists:product_categories,id'],
            'supplier' => ['nullable', 'integer', 'exists:suppliers,id'],
            'status' => ['nullable', Rule::in(['in_stock', 'low_stock', 'out_of_stock'])],
            'sort' => ['nullable', Rule::in(['name', 'price', 'stock'])],
            'direction' => ['nullable', Rule::in(['asc', 'desc'])],
        ]);

        $sort = $filters['sort'] ?? 'name';
        $direction = $filters['direction'] ?? 'asc';

        $products = Product::query()
            ->with(['category:id,name', 'supplier:id,name'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('color', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, fn ($query, $id) => $query->where('product_category_id', $id))
            ->when($filters['supplier'] ?? null, fn ($query, $id) => $query->where('supplier_id', $id))
            ->when($filters['status'] ?? null, function ($query, $status) {
                match ($status) {
                    'out_of_stock' => $query->outOfStock(),
                    'low_stock' => $query->lowStock(),
                    'in_stock' => $query->whereColumn('stock', '>', 'low_stock_threshold'),
                };
            })
            ->orderBy($sort, $direction)
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Product $product) => $this->listItem($product));

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'category' => $filters['category'] ?? '',
                'supplier' => $filters['supplier'] ?? '',
                'status' => $filters['status'] ?? '',
                'sort' => $sort,
                'direction' => $direction,
            ],
            'categories' => ProductCategory::orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Products/Create', $this->formOptions());
    }

    /**
     * Store a newly created resource in storage.
     * Opening stock is saved as the first stock movement so the audit trail starts at zero.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            ...$this->rules(),
            'stock' => ['required', 'integer', 'min:0', 'max:100000'],
        ], [], $this->attributeNames());

        $product = DB::transaction(function () use ($validated, $request) {
            $product = Product::create($validated);

            if ($product->stock > 0) {
                $product->stockMovements()->create([
                    'user_id' => $request->user()->id,
                    'type' => 'in',
                    'quantity' => $product->stock,
                    'quantity_before' => 0,
                    'quantity_after' => $product->stock,
                    'note' => 'Opening stock',
                ]);
            }

            return $product;
        });

        return redirect()
            ->route('products.show', $product)
            ->with('success', "Product \"{$product->name}\" created.");
    }

    /**
     * Display the specified resource with its stock history.
     */
    public function show(Product $product): Response
    {
        $product->load(['category:id,name', 'supplier:id,name']);

        $movements = $product->stockMovements()
            ->with('user:id,name')
            ->latest()
            ->latest('id')
            ->paginate(10)
            ->through(fn ($movement) => [
                'id' => $movement->id,
                'type' => $movement->type,
                'quantity' => $movement->quantity,
                'quantity_before' => $movement->quantity_before,
                'quantity_after' => $movement->quantity_after,
                'note' => $movement->note,
                'user' => $movement->user?->name,
                'created_at' => $movement->created_at->toIso8601String(),
            ]);

        return Inertia::render('Products/Show', [
            'product' => [
                ...$this->listItem($product),
                'description' => $product->description,
                'created_at' => $product->created_at->toIso8601String(),
                'updated_at' => $product->updated_at->toIso8601String(),
            ],
            'movements' => $movements,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            ...$this->formOptions(),
            'product' => $product->only([
                'id', 'product_category_id', 'supplier_id', 'sku', 'name', 'description',
                'price', 'size', 'color', 'stock', 'low_stock_threshold',
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Stock is not editable here on purpose; it only changes through stock in/out.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate($this->rules($product), [], $this->attributeNames());

        $product->update($validated);

        return redirect()
            ->route('products.show', $product)
            ->with('success', "Product \"{$product->name}\" updated.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $name = $product->name;

        $product->delete();

        return redirect()
            ->route('products.index')
            ->with('success', "Product \"{$name}\" deleted.");
    }

    /**
     * Validation rules shared by store and update.
     */
    private function rules(?Product $product = null): array
    {
        return [
            'product_category_id' => ['required', 'integer', 'exists:product_categories,id'],
            'supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'sku' => [
                'required', 'string', 'max:50', 'alpha_dash:ascii',
                Rule::unique('products', 'sku')->ignore($product?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'size' => ['nullable', 'string', 'max:20'],
            'color' => ['nullable', 'string', 'max:50'],
            'low_stock_threshold' => ['required', 'integer', 'min:0', 'max:100000'],
        ];
    }

    /**
     * Friendlier field names for error messages ("The category field is required.").
     */
    private function attributeNames(): array
    {
        return [
            'product_category_id' => 'category',
            'supplier_id' => 'supplier',
            'sku' => 'SKU',
            'low_stock_threshold' => 'low stock threshold',
            'stock' => 'opening stock',
        ];
    }

    private function formOptions(): array
    {
        return [
            'categories' => ProductCategory::orderBy('name')->get(['id', 'name']),
            'suppliers' => Supplier::orderBy('name')->get(['id', 'name']),
        ];
    }

    private function listItem(Product $product): array
    {
        return [
            'id' => $product->id,
            'sku' => $product->sku,
            'name' => $product->name,
            'price' => $product->price,
            'size' => $product->size,
            'color' => $product->color,
            'stock' => $product->stock,
            'low_stock_threshold' => $product->low_stock_threshold,
            'stock_status' => $product->stock_status,
            'category' => $product->category?->only(['id', 'name']),
            'supplier' => $product->supplier?->only(['id', 'name']),
        ];
    }
}
