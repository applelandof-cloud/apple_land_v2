<?php

use App\Http\Controllers\Api\StockController;
use Illuminate\Support\Facades\Route;

Route::get('/stocks', [StockController::class, 'index']);
Route::delete('/stocks', [StockController::class, 'destroy']);
