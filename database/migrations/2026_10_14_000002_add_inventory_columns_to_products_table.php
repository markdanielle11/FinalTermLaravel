<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Separate migration so the suppliers table already exists
     * before products gets its supplier_id foreign key.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('supplier_id')
                ->nullable()
                ->after('product_category_id')
                ->constrained('suppliers')
                ->nullOnDelete();

            $table->string('sku', 50)->nullable()->unique()->after('supplier_id');
            $table->string('size', 20)->nullable()->after('price');
            $table->string('color', 50)->nullable()->after('size');
            $table->unsignedInteger('low_stock_threshold')->default(10)->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('supplier_id');
            $table->dropUnique(['sku']);
            $table->dropColumn(['sku', 'size', 'color', 'low_stock_threshold']);
        });
    }
};
