<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('images')->truncate();
        DB::table('images')->insert([
            [
                'name' => 'Samsung Note 8 Image 1',
                'url' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnSrLuFmvdIUKuBWXfkobBHrpfM42Gi1r0tw&s',
            ],
            [
                'name' => 'Samsung S23 Ultra Image 1',
                'url' => 'https://m.media-amazon.com/images/I/71iBKcLHXFL.jpg',
            ],
            [
                'name' => 'Samsung S24 Image 1',
                'url' => 'https://techorbitonline.net/cdn/shop/files/2.1_1_2_bcd4539b-e171-45fd-a0db-ce5217eba201.jpg?v=1721924364',
            ],
            [
                'name' => 'iPhone 15 Image 1',
                'url' => 'https://i5.walmartimages.com/seo/Verizon-Apple-iPhone-15-256GB-Green_bc30fdbb-3344-4a55-b508-3a584f300afb.60522e6af6e7c3608a0323a216a7a8c8.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF',
            ],
            [
                'name' => 'Funda para Ipad',
                'url' => 'https://promart.vteximg.com.br/arquivos/ids/7952123-444-444/imageUrl_1.jpg',
            ],
            
        ]);
    }
}