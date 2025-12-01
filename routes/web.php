<?php

use App\Http\Controllers\StaffController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('staff', [StaffController::class, 'index'])->name('staff');
    Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
    Route::post('staff/store', [StaffController::class, 'store'])->name('staff.store.new');
    Route::patch('staff/{user}', [StaffController::class, 'update'])->name('staff.update');

    Route::get('products', function () {
        return Inertia::render('products');
    })->name('products');

    Route::get('inventory', function () {
        return Inertia::render('inventory');
    })->name('inventory');

    Route::get('places', function () {
        return Inertia::render('places');
    })->name('places');

    Route::get('sales', function () {
        return Inertia::render('sales');
    })->name('sales');

    Route::get('reports', function () {
        return Inertia::render('reports');
    })->name('reports');

});

require __DIR__.'/settings.php';