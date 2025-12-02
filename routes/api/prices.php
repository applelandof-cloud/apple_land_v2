<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PriceTypeController;

Route::get('price-types', [PriceTypeController::class, 'index']);