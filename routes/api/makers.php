<?php

use App\Http\Controllers\MakerController;
use Illuminate\Support\Facades\Route;

Route::apiResource('makers', MakerController::class);
