<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'batch_id',
        'place_id',
        'count',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }
}