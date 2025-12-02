<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'is_gift' => $this->is_gift,
            'is_visible' => $this->is_visible,
            'color_id' => $this->color_id,
            'color' => $this->whenLoaded('color', function () {
                return [
                    'id' => $this->color->id,
                    'name' => $this->color->name,
                    'hex_code' => $this->color->hex_code,
                ];
            }),
            'status_id' => $this->status_id,
            'status_name' => $this->whenLoaded('status', function () {
                return $this->status->name;
            }),
            'inventory_id' => $this->inventory_id,
            'batch_id' => $this->batch_id,
            'product_id' => $this->product_id,
            'place_id' => $this->place_id,
            'product_type_id' => $this->whenLoaded('product', function () {
                return $this->product->product_type_id;
            }),
            'accessory' => $this->whenLoaded('accessory', function () {
                return $this->accessory ? [
                    'id' => $this->accessory->id,
                    'serial_number' => $this->accessory->serial_number,
                    'size' => $this->accessory->size,
                    'description' => $this->accessory->description,
                ] : null;
            }),
            'device' => $this->whenLoaded('device', function () {
                return $this->device ? [
                    'id' => $this->device->id,
                    'imei' => $this->device->imei,
                    'imei2' => $this->device->imei2,
                    'serial_number' => $this->device->serial_number,
                    'storage' => $this->device->storage,
                ] : null;
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}