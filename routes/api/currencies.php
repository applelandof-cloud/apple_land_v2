<?php

use App\Http\Controllers\Api\CurrencyController;

Route::get('currencies', [CurrencyController::class, 'index']);
