<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Stock extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'is_gift',
        'is_visible',
        'color_id',
        'status_id',
        'inventory_id',
        'batch_id',
        'product_id',
        'place_id',
        'condition_id',
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

    public function device()
    {
        return $this->hasOne(Device::class);
    }

    public function accessory()
    {
        return $this->hasOne(Accessory::class, 'stock_id', 'id');
    }
    public function condition()
    {
        return $this->belongsTo(Condition::class);
    }
}