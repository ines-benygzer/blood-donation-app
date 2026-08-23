<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HospitalRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\HospitalRequest::create([
            'hospital_name' => 'Saint Marys General',
            'blood_type' => 'O+',
            'quantity' => 5,
            'is_urgent' => true,
            'status' => 'pending'
        ]);

        \App\Models\HospitalRequest::create([
            'hospital_name' => 'City Childrens Hospital',
            'blood_type' => 'A-',
            'quantity' => 2,
            'is_urgent' => true,
            'status' => 'pending'
        ]);

        \App\Models\HospitalRequest::create([
            'hospital_name' => 'Regional Trauma Center',
            'blood_type' => 'AB+',
            'quantity' => 1,
            'is_urgent' => false,
            'status' => 'fulfilled'
        ]);
    }
}
