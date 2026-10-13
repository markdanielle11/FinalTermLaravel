<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'product_category_id',
        'supplier_id',
        'sku',
        'name',
        'description',
        'price',
        'size',
        'color',
        'stock',
        'low_stock_threshold',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'low_stock_threshold' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * out_of_stock (0), low_stock (at or below threshold), or in_stock.
     */
    protected function stockStatus(): Attribute
    {
        return Attribute::get(function () {
            if ($this->stock <= 0) {
                return 'out_of_stock';
            }

            return $this->stock <= $this->low_stock_threshold ? 'low_stock' : 'in_stock';
        });
    }

    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where('stock', '<=', 0);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->where('stock', '>', 0)
            ->whereColumn('stock', '<=', 'low_stock_threshold');
    }
}
