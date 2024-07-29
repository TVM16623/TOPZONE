<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $banners = [
            [
                'name' => "banner 1",
                'image' => 'https://cdn.tgdd.vn/2024/04/banner/Upgrade-iPhone-2880-800--1--1920x533.png',
                'slug' => 'a',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => "banner 2",
                'image' => "https://cdn.tgdd.vn/2024/04/banner/iPad-9-2880-800-1920x533-1.png",
                'slug' => 'aaa',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => "banner 3",
                'image' => "https://cdn.tgdd.vn/2024/04/banner/AWSE-2880-800-1920x533.png",
                'slug' => 'dasd',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => "banner 4",
                'image' => "https://cdn.tgdd.vn/2024/04/banner/MacBook-chung-2880-800-1920x533.png",
                'slug' => 'dasdsdd',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ];

        // foreach ($banners as $banner) {
        //     Banner::create($banner);
        // }

        $payments = [
            [
                'name' => "COD",
                'description' => "Thanh toán khi nhận hàng",
                'icon' => "/../assets/images/COD.svg",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => "Chuyển khoản liên ngân hàng bằng QR Code",
                'description' => "Chuyển tiền qua ví điện tử (MoMo, Zalopay,...)",
                'icon' => "/../assets/images/qr.png",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ];

        foreach ($payments as $p) {
            Payment::create($p);
        }
    }
}
