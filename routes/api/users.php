<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::put('users/{user}/roles/{role}/switch', [UserController::class, 'switchRole']);
