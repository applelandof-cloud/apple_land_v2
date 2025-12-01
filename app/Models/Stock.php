<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'is_gift',
        'is_visible',
        'color_id',
        'status_id',
        'inventory_id',
        'batch_id',
        'product_id',
        'place_id',
    ];

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function status()
    {
        return $this->belongsTo(Statuses::class);
    }

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function place()
    {
        return $this->belongsTo(Place::class);
    }

    public function deviceStock()
    {
        return $this->hasOne(DeviceStock::class);
    }
}