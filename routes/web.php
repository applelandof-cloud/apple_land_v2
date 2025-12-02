<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->middleware('role_permission:ver_dashboard')->name('dashboard');

    Route::get('staff', function () {
        return Inertia::render('staff');
    })->middleware('role_permission:gestionar_usuarios')->name('staff');

    Route::get('products', function () {
        return Inertia::render('products');
    })->middleware('role_permission:ver_productos,ver_productos_admin')->name('products');

    Route::get('inventory', function () {
        return Inertia::render('inventory');
    })->middleware('role_permission:ver_inventario_vendedor')->name('inventory');

    Route::get('places', function () {
        return Inertia::render('places');
    })->middleware('role_permission:ver_sucursales')->name('places');

    Route::get('sales', function () {
        return Inertia::render('sales');
    })->middleware('role_permission:crear_ventas,ver_ventas_admin')->name('sales');

    Route::get('reports', function () {
        return Inertia::render('reports');
    })->middleware('role_permission:ver_reportes')->name('reports');

    Route::get('seller', function () {
        return Inertia::render('seller');
    })->middleware('role_permission:ver_pagina_vendedor')->name('seller');
});

require __DIR__.'/settings.php';