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
            'tech_accessory' => $this->whenLoaded('product', function () {
                return $this->product->techAccessory ? [
                    'id' => $this->product->techAccessory->id,
                    'model_number' => $this->product->techAccessory->model_number,
                    'size' => $this->product->techAccessory->size,
                    'description' => $this->product->techAccessory->description,
                ] : null;
            }),
            'device' => $this->whenLoaded('deviceStock', function () {
                return $this->deviceStock->device ? [
                    'id' => $this->deviceStock->device->id,
                    'imei' => $this->deviceStock->device->imei,
                    'imei2' => $this->deviceStock->device->imei2,
                    'serial_number' => $this->deviceStock->device->serial_number,
                ] : null;
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}