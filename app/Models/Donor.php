<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donor extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'age', 'blood_type', 'phone', 'last_donation_date'];

    // A donor can have many donations
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
