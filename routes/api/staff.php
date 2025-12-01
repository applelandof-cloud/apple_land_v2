<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StaffController;

Route::get('staff', action: [StaffController::class, 'index']);
Route::get('staff/search', [StaffController::class, 'search']);
Route::post('staff', [StaffController::class, 'store']);
Route::patch('staff/{user}', [StaffController::class, 'update']);
Route::delete('staff', [StaffController::class, 'destroy']);
Route::patch('staff/{user}/password', [StaffController::class, 'updatePassword']);