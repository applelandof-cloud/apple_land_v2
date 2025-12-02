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
        Schema::create('accessories', function (Blueprint $table) {
            $table->unsignedBigInteger('stock_id');
            $table->foreign('stock_id')->references('id')->on('stocks')->onDelete('cascade');
            $table->primary('stock_id');
            $table->string('serial_number')->unique()->nullable();
            $table->string('size')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accessories');
    }
};
