<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\PriceProduct;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with([
            'deviceModel',
            'techAccessory',
            'productType',
            'prices.currency',
            'prices.priceType',
            'colors',
            'makers',
            'images',
            'type'
        ]);

        $query->where('is_active', true);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', '%' . $searchTerm . '%');
        }

        $products = $query->get();

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'product_type_id' => 'required|exists:product_types,id',
        ];

        if ($request->input('product_type_id') == 1) {
            $rules['device_model.model_number'] = 'required|string|max:255';
        }

        $request->validate($rules);

        $productData = $request->only(['name', 'product_type_id']);
        $productData['is_active'] = true;

        $product = Product::create($productData);

        if ($request->input('product_type_id') == 1 && $request->has('device_model')) {
            $product->deviceModel()->create($request->input('device_model'));
        }

        if ($request->input('product_type_id') == 2 && $request->has('tech_accessory')) {
            $product->techAccessory()->create($request->input('tech_accessory'));
        }

        if ($request->has('colors')) {
            $colorIds = collect($request->input('colors'))->pluck('id');
            $product->colors()->sync($colorIds);
        }

        if ($request->has('prices')) {
            foreach ($request->input('prices') as $priceData) {
                $product->prices()->create([
                    'price_type_id' => data_get($priceData, 'price_type_id'),
                    'value' => data_get($priceData, 'value'),
                    'currency_id' => data_get($priceData, 'currency_id'),
                ]);
            }
        }

        $product->load([
            'deviceModel',
            'techAccessory',
            'productType',
            'prices.currency',
            'prices.priceType',
            'colors',
            'makers',
            'images',
            'type'
        ]);

        return response()->json($product, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'product_type_id' => 'required|exists:product_types,id',
        ];

        if ($request->input('product_type_id') == 1) {
            $rules['device_model.model_number'] = 'required|string|max:255';
        }

        $request->validate($rules);

        $product->update($request->only(['name', 'is_active', 'product_type_id']));

        if ($request->input('product_type_id') == 1 && $request->has('device_model')) {
            $product->deviceModel()->updateOrCreate(
                ['product_id' => $product->id],
                $request->input('device_model')
            );
        }

        if ($request->input('product_type_id') == 2 && $request->has('tech_accessory')) {
            $product->techAccessory()->updateOrCreate(
                ['product_id' => $product->id],
                $request->input('tech_accessory')
            );
        }

        if ($request->has('colors')) {
            $colorIds = collect($request->input('colors'))->pluck('id');
            $product->colors()->sync($colorIds);
        }

        if ($request->has('prices')) {
            foreach ($request->input('prices') as $priceData) {
                $priceTypeId = data_get($priceData, 'price_type_id');
                if (is_array($priceTypeId)) {
                    $priceTypeId = data_get($priceTypeId, 'id');
                }

                if (empty($priceTypeId)) {
                    continue;
                }

                $currencyId = data_get($priceData, 'currency_id');
                if (is_array($currencyId)) {
                    $currencyId = data_get($currencyId, 'id');
                }

                $product->prices()->updateOrCreate(
                    [
                        'price_type_id' => $priceTypeId,
                    ],
                    [
                        'value' => data_get($priceData, 'value'),
                        'currency_id' => $currencyId,
                    ]
                );
            }
        }

        // It's better to return the product with all the relations loaded
        $product->load([
            'deviceModel',
            'techAccessory',
            'productType',
            'prices.currency',
            'prices.priceType',
            'colors',
            'makers',
            'images',
            'type'
        ]);

        return response()->json($product);
    }

    /**
     * Soft delete multiple products.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:products,id',
        ]);

        Product::whereIn('id', $request->input('ids'))->update(['is_active' => false]);

        return response()->json(['message' => 'Products soft deleted successfully.']);
    }
}