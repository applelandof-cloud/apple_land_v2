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
        Schema::create('available', function (Blueprint $table) {
            $table->id();
            $table->string('imei', 20)->nullable();
            $table->string('imei2', 20)->nullable();
            $table->string('serial_number', 20)->nullable();
            $table->string('color', 100)->nullable();
            $table->boolean('is_gift')->default(true);
            $table->boolean('is_visible')->default(true);
            $table->string('storage', 10)->nullable();
            $table->integer('productID');
            $table->foreignId('status_id')->constrained('status')->onDelete('cascade');
            $table->foreignId('stock_id')->constrained('stock')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('available');
    }
};
