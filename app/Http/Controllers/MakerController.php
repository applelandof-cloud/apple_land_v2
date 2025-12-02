<?php

namespace App\Http\Controllers;

use App\Models\Maker; // Import the Maker model
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MakerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Maker::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'origin' => 'nullable|string|max:255',
            ]);
            $maker = Maker::create($validatedData);
            return response()->json($maker, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating maker: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $maker = Maker::find($id);
        if (!$maker) {
            return response()->json(['message' => 'Maker not found'], 404);
        }
        return $maker;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $maker = Maker::find($id);
            if (!$maker) {
                return response()->json(['message' => 'Maker not found'], 404);
            }
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'origin' => 'nullable|string|max:255',
            ]);
            $maker->update($validatedData);
            return response()->json($maker);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation Error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating maker: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $maker = Maker::find($id);
        if (!$maker) {
            return response()->json(['message' => 'Maker not found'], 404);
        }
        $maker->delete();
        return response()->json(['message' => 'Maker deleted successfully']);
    }
}
