<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accessory extends Model
{
    protected $primaryKey = 'stock_id';
    public $incrementing = false;

    protected $fillable = [
        'stock_id',
        'serial_number',
        'size',
        'description',
    ];

    public function stock()
    {
        return $this->belongsTo(Stock::class, 'stock_id', 'id');
    }
}
