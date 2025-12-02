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
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_gift')->default(false);
            $table->boolean('is_visible')->default(true);
            $table->foreignId('color_id')->constrained('colors');
            $table->foreignId('status_id')->constrained('statuses');
            $table->foreignId('inventory_id')->constrained('inventories');
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('place_id')->constrained('places')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
