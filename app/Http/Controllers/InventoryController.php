<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\InventoryResource;
use App\Http\Resources\StockResource;
use App\Models\Accessory;
use App\Models\Batch;
use App\Models\Device;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inventory::query();

        $stockFilter = function ($query) use ($request) {
            $query->with(['color', 'status', 'device', 'accessory', 'product', 'condition']);
            if ($request->filled('status_id')) {
                $query->where('status_id', $request->input('status_id'));
            }
            if ($request->filled('product_type_id')) {
                $query->whereHas('product', function ($q) use ($request) {
                    $q->where('product_type_id', $request->input('product_type_id'));
                });
            }
        };

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');

            $matchingStockIds = Stock::whereHas('device', function ($q) use ($searchTerm) {
                $q->where('imei', 'like', '%' . $searchTerm . '%')
                  ->orWhere('imei2', 'like', '%' . $searchTerm . '%')
                  ->orWhere('serial_number', 'like', '%' . $searchTerm . '%');
            })->orWhereHas('accessory', function ($q) use ($searchTerm) {
                $q->where('serial_number', 'like', '%' . $searchTerm . '%');
            })->pluck('id')->toArray();

            if (!empty($matchingStockIds)) {
                $query->whereHas('stocks', function ($q) use ($matchingStockIds) {
                    $q->whereIn('id', $matchingStockIds);
                })->with(['product.images', 'batch', 'place', 'stocks' => function ($q) use ($matchingStockIds, $stockFilter) {
                    $stockFilter($q);
                    $q->whereIn('id', $matchingStockIds);
                }]);
            } else {
                $query->whereHas('product', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%');
                })->with(['product.images', 'batch', 'place', 'stocks' => $stockFilter]);
            }
        } else {
            $query->with(['product.images', 'batch', 'place', 'stocks' => $stockFilter]);
        }

        // Advanced Filters
        if ($request->filled('place_id')) {
            $query->where('place_id', $request->input('place_id'));
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('created_at', [$request->input('start_date'), $request->input('end_date')]);
        }

        if ($request->filled('status_id')) {
            $query->whereHas('stocks', function ($q) use ($request) {
                $q->where('status_id', $request->input('status_id'));
            });
        }

        if ($request->filled('product_type_id')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('product_type_id', $request->input('product_type_id'));
            });
        }

        $inventories = $query->paginate(10);

        return InventoryResource::collection($inventories);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|exists:products,id',
            'entry_date' => 'required|date',
            'expiration_date' => 'nullable|date|after_or_equal:entry_date',
            'place_id' => 'required|exists:places,id',
            'count' => 'required|integer|min:1',
            'stocks' => 'required|array|size:' . $request->input('count'),
            'stocks.*.color_id' => 'required|exists:colors,id',
            'stocks.*.is_gift' => 'required|boolean',
            'stocks.*.status_id' => 'required|exists:statuses,id',
            'stocks.*.imei' => 'nullable|string|max:255',
            'stocks.*.imei2' => 'nullable|string|max:255',
            'stocks.*.serial_number' => 'nullable|string|max:255',
            'stocks.*.storage' => 'nullable|string|max:255',
            'stocks.*.size' => 'nullable|string|max:255',
            'stocks.*.description' => 'nullable|string',

        ]);

        DB::beginTransaction();

        try {
            $product = Product::findOrFail($validatedData['product_id']);

            // Create Batch
            $batch = Batch::create([
                'product_id' => $validatedData['product_id'],
                'entry_date' => $validatedData['entry_date'],
                'expiration_date' => $validatedData['expiration_date'],
            ]);

            // Create Inventory
            $inventory = Inventory::create([
                'product_id' => $validatedData['product_id'],
                'batch_id' => $batch->id,
                'place_id' => $validatedData['place_id'],
                'count' => $validatedData['count'],
            ]);

            foreach ($validatedData['stocks'] as $stockData) {
                // Initialize device_id to null
                // $deviceId = null;

                $stock = Stock::create([
                    'inventory_id' => $inventory->id,
                    'product_id' => $validatedData['product_id'],
                    'batch_id' => $batch->id,
                    'place_id' => $validatedData['place_id'],
                    'color_id' => $stockData['color_id'],
                    'is_gift' => $stockData['is_gift'],
                    'status_id' => $stockData['status_id'],
                ]);


                if ($product->product_type_id === 1) { // Device
                    Device::create([
                        'stock_id' => $stock->id,
                        'imei' => $stockData['imei'] ?? null,
                        'imei2' => $stockData['imei2'] ?? null,
                        'serial_number' => $stockData['serial_number'] ?? null,
                        'storage' => isset($stockData['storage']) ? (int) $stockData['storage'] : null,
                    ]);
                }

                if ($product->product_type_id === 2) { // Accessory
                    Accessory::create([
                        'stock_id' => $stock->id,
                        'serial_number' => $stockData['serial_number'] ?? null,
                        'size' => $stockData['size'] ?? null,
                        'description' => $stockData['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json(['message' => 'Inventory added successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to add inventory', 'error' => $e->getMessage()], 500);
        }
    }
}
