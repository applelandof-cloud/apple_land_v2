<?php

namespace App\Http\Controllers;

use App\Http\Resources\InventoryResource;
use App\Http\Resources\StockResource;
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

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');

            // Check if the search term matches any device details
            $matchingStockIds = Stock::whereHas('deviceStock.device', function ($q) use ($searchTerm) {
                $q->where('imei', 'like', '%' . $searchTerm . '%')
                  ->orWhere('imei2', 'like', '%' . $searchTerm . '%')
                  ->orWhere('serial_number', 'like', '%' . $searchTerm . '%');
            })->pluck('id')->toArray();

            if (!empty($matchingStockIds)) {
                // If device details match, filter inventories by these stocks
                $query->whereHas('stocks', function ($q) use ($matchingStockIds) {
                    $q->whereIn('id', $matchingStockIds);
                })->with(['product.images', 'batch', 'place', 'stocks' => function ($q) use ($matchingStockIds) {
                    $q->whereIn('id', $matchingStockIds)->with(['color', 'status', 'deviceStock.device', 'product.productType', 'product.techAccessory']);
                }]);
            } else {
                // Fallback to product name search if no device match
                $query->whereHas('product', function ($q) use ($searchTerm) {
                    $q->where('name', 'like', '%' . $searchTerm . '%');
                })->with(['product.images', 'batch', 'place', 'stocks.color', 'stocks.status', 'stocks.deviceStock.device', 'stocks.product.productType', 'stocks.product.techAccessory']);
            }
        } else {
            // Default eager loading if no search term
            $query->with(['product.images', 'batch', 'place', 'stocks.color', 'stocks.status', 'stocks.deviceStock.device', 'stocks.product.productType', 'stocks.product.techAccessory']);
        }

        $inventories = $query->paginate(10);

        return InventoryResource::collection($inventories);
    }

    public function showStocks(Request $request, Inventory $inventory)
    {
        $query = $inventory->stocks()->with(['color', 'status', 'deviceStock.device', 'product.productType', 'product.techAccessory']);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('deviceStock.device', function ($q) use ($searchTerm) {
                    $q->where('imei', 'like', '%' . $searchTerm . '%')
                      ->orWhere('imei2', 'like', '%' . $searchTerm . '%')
                      ->orWhere('serial_number', 'like', '%' . $searchTerm . '%');
                });
            });
        }

        $stocks = $query->paginate(10);

        return StockResource::collection($stocks);
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
                        'imei' => $stockData['imei'],
                        'imei2' => $stockData['imei2'],
                        'serial_number' => $stockData['serial_number'],
                        'storage' => $stockData['storage'],
                        'status_id' => $stockData['status_id'],
                    ]);
                }
                // For tech accessories, the user didn't specify fields to create,
                // so we'll assume they are linked to existing ones or the product itself
                // and no new TechAccessory record is created here.
            }

            DB::commit();

            return response()->json(['message' => 'Inventory added successfully'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to add inventory', 'error' => $e->getMessage()], 500);
        }
    }
}
