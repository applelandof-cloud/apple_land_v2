<?php

namespace App\Http\Controllers;

use App\Http\Resources\StockResource;
use App\Models\Inventory;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'inventory_id' => 'required|exists:inventories,id'
        ]);

        $inventory = Inventory::findOrFail($request->input('inventory_id'));

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

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'stock_ids' => 'required|array',
            'stock_ids.*' => 'integer|exists:stocks,id',
        ]);

        $stockIds = $validated['stock_ids'];

        DB::beginTransaction();
        try {
            $stocks = Stock::with('inventory')->whereIn('id', $stockIds)->get();

            $inventoryCounts = [];

            foreach ($stocks as $stock) {
                if ($stock->inventory) {
                    $inventoryId = $stock->inventory->id;
                    if (!isset($inventoryCounts[$inventoryId])) {
                        $inventoryCounts[$inventoryId] = 0;
                    }
                    $inventoryCounts[$inventoryId]++;
                }
            }

            // Soft delete stocks
            Stock::whereIn('id', $stockIds)->delete();

            // Update inventory counts
            foreach ($inventoryCounts as $inventoryId => $count) {
                DB::table('inventories')->where('id', $inventoryId)->decrement('count', $count);
            }

            DB::commit();

            return response()->json(['message' => 'Selected stocks have been deleted successfully.']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete stocks.', 'error' => $e->getMessage()], 500);
        }
    }
}
