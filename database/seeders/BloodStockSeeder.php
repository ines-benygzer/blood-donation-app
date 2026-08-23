<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BloodStock;

class BloodStockSeeder extends Seeder
{
    public function run(): void
    {
        $types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        foreach ($types as $type) {
            BloodStock::firstOrCreate(
                ['blood_type' => $type],
                ['quantity' => 0]
            );
        }
    }
}
