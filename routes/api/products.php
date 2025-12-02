<?php
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\ProductTypeController;

Route::get('products', [ProductController::class, 'index']);
Route::post('products', [ProductController::class, 'store']);
Route::put('products/{product}', [ProductController::class, 'update']);
Route::post('products/bulk-delete', [ProductController::class, 'bulkDelete']); // New route for bulk delete
Route::get('products/{product}/devicemodel', [ProductController::class, 'showDeviceModel']);
Route::post('products/{product}/images', [ProductImageController::class, 'store']);
Route::get('product-types', [ProductTypeController::class, 'index']);
