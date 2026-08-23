<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = ['donor_id', 'session_id', 'quantity', 'date'];

    // A donation belongs to a donor
    public function donor()
    {
        return $this->belongsTo(Donor::class);
    }

    // A donation belongs to a session
    public function session()
    {
        return $this->belongsTo(Session::class);
    }
}
