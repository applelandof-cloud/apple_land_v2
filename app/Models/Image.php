<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = ['name', 'url'];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'image_product');
    }
}