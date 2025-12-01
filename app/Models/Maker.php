<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maker extends Model
{
    public function products()
    {
        return $this->belongsToMany(Product::class, 'maker_product');
    }
}