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
        'status_id',
    ];

    public function status()
    {
        return $this->belongsTo(Statuses::class);
    }

    public function deviceStock()
    {
        return $this->hasOne(DeviceStock::class);
    }
}