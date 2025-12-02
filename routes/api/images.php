<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductImageController;

Route::delete('images/{image}', [ProductImageController::class, 'destroy']);
