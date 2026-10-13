<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = $request->validate(['search' => ['nullable', 'string', 'max:100']])['search'] ?? '';

        $suppliers = Supplier::query()
            ->withCount('products')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('contact_person', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Supplier $supplier) => [
                ...$supplier->only(['id', 'name', 'contact_person', 'contact_number', 'email']),
                'products_count' => $supplier->products_count,
            ]);

        return Inertia::render('Suppliers/Index', [
            'suppliers' => $suppliers,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Suppliers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $supplier = Supplier::create($request->validate($this->rules()));

        return redirect()
            ->route('suppliers.index')
            ->with('success', "Supplier \"{$supplier->name}\" added.");
    }

    /**
     * Display the specified resource and the products it supplies.
     */
    public function show(Supplier $supplier): Response
    {
        $products = $supplier->products()
            ->with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn ($product) => [
                'id' => $product->id,
                'sku' => $product->sku,
                'name' => $product->name,
                'stock' => $product->stock,
                'stock_status' => $product->stock_status,
                'category' => $product->category?->name,
            ]);

        return Inertia::render('Suppliers/Show', [
            'supplier' => $supplier->only(['id', 'name', 'contact_person', 'contact_number', 'email', 'address']),
            'products' => $products,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('Suppliers/Edit', [
            'supplier' => $supplier->only(['id', 'name', 'contact_person', 'contact_number', 'email', 'address']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
        $supplier->update($request->validate($this->rules($supplier)));

        return redirect()
            ->route('suppliers.index')
            ->with('success', "Supplier \"{$supplier->name}\" updated.");
    }

    /**
     * Remove the specified resource from storage.
     * Products keep existing; their supplier_id becomes null (nullOnDelete).
     */
    public function destroy(Supplier $supplier)
    {
        $name = $supplier->name;
        $supplier->delete();

        return redirect()
            ->route('suppliers.index')
            ->with('success', "Supplier \"{$name}\" deleted. Its products are now unassigned.");
    }

    private function rules(?Supplier $supplier = null): array
    {
        return [
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('suppliers', 'name')->ignore($supplier?->id),
            ],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:30', 'regex:/^[0-9+\-\s()]+$/'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ];
    }
}
