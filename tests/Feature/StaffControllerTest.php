<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use App\Models\Place;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_remove_user_from_staff()
    {
        $role = Role::factory()->create();
        $place = Place::factory()->create();
        $user = User::factory()->create(['is_active' => true]);
        $user->roles()->attach($role->id);
        $user->places()->attach($place->id);

        $response = $this->deleteJson('/api/staff', ['ids' => [$user->id]]);

        $response->assertStatus(204);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_active' => false,
        ]);

        $this->assertDatabaseMissing('role_user', [
            'user_id' => $user->id,
            'role_id' => $role->id,
        ]);

        $this->assertDatabaseMissing('place_user', [
            'user_id' => $user->id,
            'place_id' => $place->id,
        ]);
    }
}
