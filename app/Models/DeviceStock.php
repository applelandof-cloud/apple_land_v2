<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceStock extends Model
{
    use HasFactory;

    protected $table = 'device_stock';

    protected $fillable = [
        'device_id',
        'stock_id',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}