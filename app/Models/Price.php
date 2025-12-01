<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $fillable = [
        'value',
        'currency_id',
    ];

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function priceType()
    {
        return $this->belongsTo(PriceType::class);
    }
}