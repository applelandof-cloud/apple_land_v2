<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PlaceController;

Route::get('/places', [PlaceController::class, 'index']);
