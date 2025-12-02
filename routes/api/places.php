<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PlaceController;


Route::get('places', [PlaceController::class, 'index']);
Route::post('places', [PlaceController::class, 'store']);
Route::patch('places/{place}', [PlaceController::class, 'update']);
Route::delete('places/{place}', [PlaceController::class, 'destroy']);
