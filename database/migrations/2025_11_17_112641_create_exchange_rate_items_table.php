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
        Schema::create('exchange_rate_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exchange_rate_id')->constrained('exchange_rates');
            $table->decimal('value', 10, 2);
            $table->foreignId('user_id')->constrained('users');
            $table->timestamp('deactivated_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exchange_rate_items');
    }
};