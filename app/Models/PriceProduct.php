<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class PriceProduct extends Model
{
    use HasFactory;
    protected $table = 'price_product';

    protected $fillable = [
        'product_id',
        'price_type_id',
        'value',
        'currency_id',
    ];

    public $incrementing = false;

    /**
     * Set the keys for a save update query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function setKeysForSaveQuery($query)
    {
        return $query->where('product_id', $this->getAttribute('product_id'))
            ->where('price_type_id', $this->getAttribute('price_type_id'));
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function priceType()
    {
        return $this->belongsTo(PriceType::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
