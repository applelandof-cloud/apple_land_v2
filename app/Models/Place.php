<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = [
        'name',
        'address',
    ];

    // 🔗 Relationship: a place can have many users
    public function users()
    {
        return $this->belongsToMany(
            User::class,
            'place_user',
  'place_id',
  'user_id')->withTimestamps();
    }
}
