<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductTypeController;

Route::get('/product-types', [ProductTypeController::class, 'index']);
