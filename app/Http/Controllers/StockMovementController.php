<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    /**
     * Stock history (audit trail) for all products.
     * Can be narrowed by product, type (in/out), and a date range.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'type' => ['nullable', Rule::in(['in', 'out'])],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $movements = StockMovement::query()
            ->with(['product:id,name,sku', 'user:id,name'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->whereHas('product', function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($filters['type'] ?? null, fn ($query, $type) => $query->where('type', $type))
            // The dates are picked in Philippine time, but the database stores UTC,
            // so each date is turned into the start or end of that day in UTC.
            ->when($filters['from'] ?? null, fn ($query, $from) => $query->where(
                'created_at', '>=', Carbon::parse($from, 'Asia/Manila')->startOfDay()->utc()
            ))
            ->when($filters['to'] ?? null, fn ($query, $to) => $query->where(
                'created_at', '<=', Carbon::parse($to, 'Asia/Manila')->endOfDay()->utc()
            ))
            ->latest()
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (StockMovement $movement) => [
                'id' => $movement->id,
                'type' => $movement->type,
                'quantity' => $movement->quantity,
                'quantity_before' => $movement->quantity_before,
                'quantity_after' => $movement->quantity_after,
                'note' => $movement->note,
                'product' => $movement->product?->only(['id', 'name', 'sku']),
                'user' => $movement->user?->name,
                'created_at' => $movement->created_at->toIso8601String(),
            ]);

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'type' => $filters['type'] ?? '',
                'from' => $filters['from'] ?? '',
                'to' => $filters['to'] ?? '',
            ],
        ]);
    }

    /**
     * Record a stock in/out and update the product's stock in one transaction.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'type' => ['required', Rule::in(['in', 'out'])],
            'quantity' => ['required', 'integer', 'min:1', 'max:100000'],
            'note' => ['nullable', 'string', 'max:255'],
        ], [], ['product_id' => 'product', 'type' => 'movement']);

        $product = DB::transaction(function () use ($validated, $request) {
            // Lock the row so two people adjusting at once cannot overwrite each other.
            $product = Product::whereKey($validated['product_id'])->lockForUpdate()->firstOrFail();

            $before = $product->stock;

            if ($validated['type'] === 'out' && $validated['quantity'] > $before) {
                throw ValidationException::withMessages([
                    'quantity' => "Only {$before} unit(s) of {$product->name} are in stock.",
                ]);
            }

            $after = $validated['type'] === 'in'
                ? $before + $validated['quantity']
                : $before - $validated['quantity'];

            $product->stockMovements()->create([
                'user_id' => $request->user()->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'quantity_before' => $before,
                'quantity_after' => $after,
                'note' => $validated['note'] ?? null,
            ]);

            $product->update(['stock' => $after]);

            return $product;
        });

        $verb = $validated['type'] === 'in' ? 'added to' : 'removed from';

        $response = back()->with('success', "{$validated['quantity']} unit(s) {$verb} {$product->name}. New stock: {$product->stock}.");

        // Low-stock alert after the change (shown as a yellow pop-up).
        if ($product->stock <= 0) {
            $response->with('warning', "{$product->name} is now out of stock.");
        } elseif ($product->stock <= $product->low_stock_threshold) {
            $response->with('warning', "{$product->name} is low on stock: {$product->stock} left (alert at {$product->low_stock_threshold}).");
        }

        return $response;
    }
}
