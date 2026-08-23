<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Donor;

class DonorSeeder extends Seeder
{
    public function run(): void
    {
        Donor::create([
            'name' => 'John Doe',
            'age' => 28,
            'blood_type' => 'A+',
            'last_donation_date' => '2024-12-01'
        ]);

        Donor::create([
            'name' => 'Sarah Smith',
            'age' => 32,
            'blood_type' => 'O-',
            'last_donation_date' => '2024-11-15'
        ]);
    }
}
