<?php

namespace Database\Seeders;

use App\Models\Place;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlaceUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('place_user')->delete();

        // Get the user(s)
        $user = User::where('username', 'sonia')->first();

        // Get all places
        $places = Place::all();

        // Attach user to all places (or specific ones)
        foreach ($places as $place) {
            DB::table('place_user')->insert([
                'user_id' => $user->id,
                'place_id' => $place->id
            ]);
        }
    }
}
