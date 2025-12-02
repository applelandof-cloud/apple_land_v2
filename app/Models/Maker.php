<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maker extends Model
{
    protected $fillable = [
        'name',
        'origin',
        'updated_at',
        'created_at'
    ];
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}