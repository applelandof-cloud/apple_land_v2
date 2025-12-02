<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accessory extends Model
{
    protected $fillable = [
        'stock_id',
        'serial_number',
        'size'
    ];

    public function stock()
    {
        return $this->belongsTo(stock::class);
    }
}
