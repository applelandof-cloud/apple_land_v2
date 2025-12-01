<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StatusController;

Route::get('/statuses', [StatusController::class, 'index']);
