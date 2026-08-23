<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HospitalRequest extends Model
{
    protected $fillable = [
        'hospital_name',
        'blood_type',
        'quantity',
        'is_urgent',
        'status',
    ];

    protected $casts = [
        'is_urgent' => 'boolean',
    ];
    //
}
