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
        Schema::create('price_stock', function (Blueprint $table) {
            $table->foreignId('stock_id')->constrained('stocks');
            $table->primary('stock_id');
            $table->foreignId('price_type_id')->constrained('price_types')->cascadeOnDelete();
            $table->decimal('value', 10, 2);
            $table->foreignId('currency_id')->constrained('currencies');
            $table->timestamps();
        });
    }

    /**
 * Reverse the migrations.[]
     */
    public function down(): void
    {
        Schema::dropIfExists('price_stock');
    }
};