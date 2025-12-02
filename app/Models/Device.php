<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'imei',
        'imei2',
        'serial_number',
        'storage',
        'stock_id',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }
}