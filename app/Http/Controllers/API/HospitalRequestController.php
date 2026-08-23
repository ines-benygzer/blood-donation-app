<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\HospitalRequest;
use App\Models\BloodStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class HospitalRequestController extends Controller
{
    public function index()
    {
        return HospitalRequest::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hospital_name' => 'required|string',
            'blood_type' => 'required|string',
            'quantity' => 'required|integer|min:1',
            'is_urgent' => 'boolean',
        ]);

        return HospitalRequest::create($validated);
    }

    public function fulfill($id)
    {
        // Only admin can fulfill
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Only administrators can fulfill requests.'], 403);
        }

        $hospitalRequest = HospitalRequest::findOrFail($id);

        if ($hospitalRequest->status === 'fulfilled') {
            return response()->json(['message' => 'Request already fulfilled.'], 400);
        }

        return DB::transaction(function () use ($hospitalRequest) {
            $stock = BloodStock::where('blood_type', $hospitalRequest->blood_type)->first();

            if (!$stock || $stock->quantity < $hospitalRequest->quantity) {
                return response()->json(['message' => 'Insufficient blood stock for this type.'], 422);
            }

            // Deduct from stock
            $stock->decrement('quantity', $hospitalRequest->quantity);

            // Update status
            $hospitalRequest->update(['status' => 'fulfilled']);

            return response()->json([
                'message' => 'Request fulfilled successfully.',
                'request' => $hospitalRequest,
                'remaining_stock' => $stock->quantity
            ]);
        });
    }
}
