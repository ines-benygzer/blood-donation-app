<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function index()
    {
        return Donation::with(['donor', 'session'])->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'donor_id' => 'required|exists:donors,id',
            'session_id' => 'required|exists:sessions,id',
            'quantity' => 'required|integer|min:1',
            'date' => 'required|date',
        ]);

        return \DB::transaction(function () use ($request) {
            // 1. Create the donation record
            $donation = Donation::create($request->all());

            // 2. Find the donor to get their blood type
            $donor = \App\Models\Donor::find($request->donor_id);

            // 3. Find the stock for that blood type and increment
            $stock = \App\Models\BloodStock::where('blood_type', $donor->blood_type)->first();
            
            if ($stock) {
                $stock->increment('quantity', $request->quantity);
            }

            return $donation;
        });
    }

    public function show(Donation $donation)
    {
        return $donation->load(['donor', 'session']);
    }

    public function destroy(Donation $donation)
    {
        $donation->delete();
        return response()->json(null, 204);
    }
}
