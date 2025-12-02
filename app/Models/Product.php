<?php

namespace App\Models;

use App\Models\Maker; // New import
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'is_active',
        'product_type_id',
        'maker_id',
    ];

    protected $with = ['productType'];
    protected $appends = ['primary_image_url'];

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


    public function maker()
    {
        return $this->belongsTo(Maker::class);
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'image_product');
    }

    public function getPrimaryImageUrlAttribute(): string
    {
        if ($this->images->isNotEmpty()) {
            return $this->images->first()->url;
        }

        if ($this->productType && $this->productType->id === 2) {
            return asset('placeholders/accessory.webp');
        }

        return asset('placeholders/phone.webp');
    }
    

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }
}