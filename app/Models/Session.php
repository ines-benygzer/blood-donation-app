<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = ['location', 'date', 'time'];

    // A session can have many donations
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
