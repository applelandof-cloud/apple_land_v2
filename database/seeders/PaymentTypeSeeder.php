<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('payment_type')->insert([
            [
                'name' => 'QR',
                'type' => 'QR',
                'currency_id' => 1,
                'commission' => 0.0
            ],
            [
                'name' => 'Efectivo Bs',
                'type' => 'Efectivo',
                'currency_id' => 1,
                'commission' => 0.0
            ],
            [
                'name' => 'Efectivo USD',
                'type' => 'Efectivo',
                'currency_id' => 2,
                'commission' => 0.0
            ],
            [
                'name' => 'Tarjeta bs',
                'type' => 'Tarjeta',
                'currency_id' => 1,
                'commission' => 2.5
            ],
            [
                'name' => 'Avaluo dispositivo',
                'type' => 'Dispositivo',
                'currency_id' => 1,
                'commission' => 0.0
            ]
        ]);
    }
}
