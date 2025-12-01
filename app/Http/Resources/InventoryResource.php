<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryResource extends JsonResource
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
            'product_id' => $this->product_id,
            'product_name' => $this->whenLoaded('product', function () {
                return $this->product->name;
            }),
            'product_image_url' => $this->whenLoaded('product', function () {
                return $this->product->images->first()->url ?? null;
            }),
            'batch_id' => $this->batch_id,
            'batch_entry_date' => $this->whenLoaded('batch', function () {
                return $this->batch->entry_date;
            }),
            'batch_expiration_date' => $this->whenLoaded('batch', function () {
                return $this->batch->expiration_date;
            }),
            'place_id' => $this->place_id,
            'place_name' => $this->whenLoaded('place', function () {
                return $this->place->name;
            }),
            'count' => $this->count,
            'stocks' => StockResource::collection($this->whenLoaded('stocks')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}