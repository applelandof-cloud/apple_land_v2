<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $primaryKey = "stock_id";

    protected $fillable = [
        'stock_id',
        'imei',
        'imei2',
        'serial_number',
        'storage',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id', 'id');
    }
}