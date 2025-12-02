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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 14)->unique();
            $table->string('fullname', 80);
            $table->string('email', 50)->nullable();
            $table->string('identification',15);
            $table->integer('points')->default(0);
            $table->string('phone_number', 10);
            $table->boolean('is_active')->default(true);
            $table->foreignId('customer_type_id')->constrained('customer_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer');
    }
};
