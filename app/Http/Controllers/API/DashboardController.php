<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BloodStock;
use App\Models\Donation;
use App\Models\Donor;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalDonors = Donor::count();
        $totalDonationsThisMonth = Donation::whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->count();
        
        $bloodStock = BloodStock::all()->map(function ($stock) {
            return [
                'blood_type' => $stock->blood_type,
                'quantity' => $stock->quantity,
                // Assuming standard bag is ~450ml, let's say critical is < 5 units (2250ml) or based on bags if tracked that way
                'is_critical' => $stock->quantity < 5, 
            ];
        });

        $recentDonations = Donation::with('donor')
            ->latest('date')
            ->take(5)
            ->get()
            ->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'donor_name' => $donation->donor->name,
                    'blood_type' => $donation->donor->blood_type,
                    'quantity' => $donation->quantity,
                    'date' => $donation->date,
                ];
            });

        $urgentRequests = \App\Models\HospitalRequest::where('status', 'pending')
            ->where('is_urgent', true)
            ->latest()
            ->get();

        return response()->json([
            'stats' => [
                'total_donors' => $totalDonors,
                'monthly_donations' => $totalDonationsThisMonth,
                'blood_stock' => $bloodStock,
                'recent_donations' => $recentDonations,
                'urgent_hospital_requests' => $urgentRequests,
            ]
        ]);
    }
}
