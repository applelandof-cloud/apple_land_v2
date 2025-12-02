<?php

use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Route;

Route::get('/stocks', [StockController::class, 'index']);
Route::delete('/stocks', [StockController::class, 'destroy']);
