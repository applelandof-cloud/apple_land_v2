<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeviceModel extends Model
{
    protected $primaryKey = 'product_id';
    public $incrementing = false;

    protected $fillable = [
        'product_id',
        'model_number',
        'sku',
        'sim',
        'storage',
        'ram',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id','id');
    }
}