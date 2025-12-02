<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'is_active',
        'product_type_id',
    ];

    public function deviceModel()
    {
        return $this->hasOne(DeviceModel::class);
    }

    public function techAccessory()
    {
        return $this->hasOne(TechAccessory::class);
    }

    public function productType()
    {
        return $this->belongsTo(ProductType::class);
    }

    public function prices()
    {
        return $this->hasMany(PriceProduct::class, 'product_id', 'id');
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class, 'color_product');
    }

    public function makers()
    {
        return $this->belongsToMany(Maker::class, 'maker_product');
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'image_product');
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }
}