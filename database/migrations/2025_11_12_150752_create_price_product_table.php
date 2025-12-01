<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('price_product', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('price_type_id')->constrained('price_types')->cascadeOnDelete();
            $table->primary(['product_id', 'price_type_id']);
            $table->decimal('value', 10, 2);
            $table->foreignId('currency_id')->constrained('currencies')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('price_product');
    }
};
