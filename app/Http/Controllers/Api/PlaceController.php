<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function index()
    {
        return Place::where('is_active', 1)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'string|max:255',
        ]);

        $place = Place::create([
            'name' => $request->name,
            'address' => $request->address,
        ]);

        return response()->json([
            'place' => $place
        ], 201);
    }

    public function update(Request $request, Place $place)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'address' => 'required|string|max:255',
        ]);

        $place->update([
            'name' => $request->name,
            'address' => $request->address,
        ]);

        return response()->json([
            'place' => $place
        ]);
    }

    public function destroy(Place $place)
    {
        $place->delete();

        return response()->json(null, 204);
    }
}
