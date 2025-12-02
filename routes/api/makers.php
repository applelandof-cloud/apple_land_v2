<?php

use App\Http\Controllers\Api\MakerController;
use Illuminate\Support\Facades\Route;

Route::apiResource('makers', MakerController::class);
