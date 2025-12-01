<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $path = $request->file('image')->store('products', 'public');
        // Return a relative URL to be environment-agnostic. The browser will resolve it.
        $url = '/storage/'.$path;

        $image = Image::create([
            'name' => $request->file('image')->getClientOriginalName(),
            'url' => $url,
        ]);

        $product->images()->attach($image->id);

        return response()->json($image, 201);
    }

    public function destroy(Image $image)
    {
        // Get the path from the URL (e.g., /storage/products/image.jpg -> products/image.jpg)
        $path = ltrim(parse_url($image->url, PHP_URL_PATH), '/storage/');
        
        Storage::disk('public')->delete($path);

        $image->delete();

        return response()->json(null, 204);
    }
}