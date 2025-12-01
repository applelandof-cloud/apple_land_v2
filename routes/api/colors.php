<?php
use App\Http\Controllers\Api\ColorController;

Route::get('colors', [ColorController::class, 'index']);
Route::post('colors', [ColorController::class, 'store']);
Route::put('colors/{color}', [ColorController::class, 'update']);
Route::delete('colors/{color}', [ColorController::class, 'destroy']);
