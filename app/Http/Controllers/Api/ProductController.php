<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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
            'categories',
            'colors',
            'maker',
            'images',
            'type'
        ]);

        $query->where('is_active', true);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('deviceModel', function ($q) use ($searchTerm) {
                        $q->where('model_number', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('techAccessory', function ($q) use ($searchTerm) {
                        $q->where('model_number', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        // Filter by color_ids
        if ($request->filled('color_ids')) {
            $colorIds = (array) $request->input('color_ids');
            $query->whereHas('colors', function ($q) use ($colorIds) {
                $q->whereIn('colors.id', $colorIds);
            });
        }

        // Filter by category_ids
        if ($request->filled('category_ids')) {
            $categoryIds = (array) $request->input('category_ids');
            $query->whereHas('categories', function ($q) use ($categoryIds) {
                $q->whereIn('categories.id', $categoryIds);
            });
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
            'maker_id' => 'nullable|exists:makers,id',
            'colors' => 'array',
            'colors.*.id' => 'exists:colors,id',
            'categories' => 'array',
            'categories.*.id' => 'exists:categories,id',
            'prices' => 'required|array|min:1',
            'prices.*.price_type_id' => 'required|exists:price_types,id',
            'prices.*.value' => 'required|numeric|min:0.01',
            'prices.*.currency_id' => 'required|exists:currencies,id',
        ];

        if ($request->input('product_type_id') == 1) {
            $rules = array_merge($rules, [
                'device_model.model_number' => 'required|string|max:255',
                'device_model.sku' => 'nullable|string|max:255',
                'device_model.sim' => 'nullable|string|max:255',
                'device_model.storage' => 'nullable|string|max:255',
                'device_model.ram' => 'nullable|string|max:255',
            ]);
        } elseif ($request->input('product_type_id') == 2) {
            $rules = array_merge($rules, [
                'tech_accessory.model_number' => 'required|string|max:255',
                'tech_accessory.size' => 'nullable|string|max:255',
                'tech_accessory.description' => 'nullable|string|max:255',
            ]);
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = DB::transaction(function () use ($request) {
                $productData = $request->only(['name', 'product_type_id', 'maker_id']);
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

                if ($request->has('categories')) {
                    $categoriesIds = collect($request->input('categories'))->pluck('id');
                    $product->categories()->sync($categoriesIds);
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
                return $product;
            });

            $product->load([
                'deviceModel',
                'techAccessory',
                'productType',
                'prices.currency',
                'prices.priceType',
                'categories',
                'colors',
                'maker',
                'images',
                'type'
            ]);

            return response()->json($product, 201);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            Log::error('Duplicate entry error creating product: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'El número de modelo del dispositivo ya existe. Por favor, ingrese uno diferente.', 'error' => $e->getMessage()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating product: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['message' => 'Failed to create product due to an internal error.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        if (!$product || !isset($product->id)) {
            Log::warning('Product in update method is missing ID:', ['product' => $product]);
            return response()->json(['message' => 'Product not found or invalid'], 404);
        }
        $rules = [
            'name' => 'required|string|max:255',
            'product_type_id' => 'required|exists:product_types,id',
            'maker_id' => 'nullable|exists:makers,id',
        ];

        if ($request->input('product_type_id') == 1) {
            $rules = array_merge($rules, ['device_model.model_number' => 'required|string|max:255']);
        } elseif ($request->input('product_type_id') == 2) {
            $rules = array_merge($rules, ['tech_accessory.model_number' => 'required|string|max:255']);
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $product->update($request->only(['name', 'is_active', 'product_type_id', 'maker_id', 'description']));

        if ($request->input('product_type_id') == 1 && $request->filled('device_model')) {
            $product->deviceModel()->updateOrCreate(
                ['product_id' => $product->id],
                $request->input('device_model')
            );
        }

        if ($request->input('product_type_id') == 2 && $request->filled('tech_accessory')) {
            $product->techAccessory()->updateOrCreate(
                ['product_id' => $product->id],
                $request->input('tech_accessory')
            );
        }

        if ($request->has('colors')) {
            $colorIds = collect($request->input('colors'))->pluck('id');
            $product->colors()->sync($colorIds);
        }

        if ($request->has('categories')) {
            $categoriesIds = collect($request->input('categories'))->pluck('id');
            $product->categories()->sync($categoriesIds);
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
            'categories',
            'colors',
            'maker',
            'images',
            'type'
        ]);

        return response()->json($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        if (!$product || !isset($product->id)) {
            Log::warning('Product in show method is missing ID:', ['product' => $product]);
            return response()->json(['message' => 'Product not found or invalid'], 404);
        }

        $product->load([
            'deviceModel',
            'techAccessory',
            'productType',
            'prices.currency',
            'prices.priceType',
            'colors',
            'maker',
            'images',
            'type',
            'categories'
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

    public function showDeviceModel(Product $product)
    {
        return response()->json($product->deviceModel);
    }

    public function search(Request $request)
    {
        $query = Product::with(['images']);

        if ($request->has('q')) {
            $searchTerm = $request->input('q');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('deviceModel', function ($q) use ($searchTerm) {
                        $q->where('model_number', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('techAccessory', function ($q) use ($searchTerm) {
                        $q->where('model_number', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        $products = $query->where('is_active', true)->take(10)->get();

        return response()->json($products);
    }
}