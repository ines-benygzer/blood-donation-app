<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Donor;
use Illuminate\Http\Request;

class DonorController extends Controller
{
    public function index()
    {
        return response()->json(Donor::withCount('donations')->latest()->get());
    }

    public function store(Request $request)
    {
        \Log::info('Donor Store Request:', $request->all());
        $request->validate([
            'name' => 'required|string',
            'age' => 'required|integer',
            'blood_type' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        $donor = Donor::create($request->all());
        return response()->json($donor, 201);
    }

    public function show(Donor $donor)
    {
        return $donor;
    }

    public function update(Request $request, Donor $donor)
    {
        $donor->update($request->all());
        return response()->json($donor);
    }

    public function destroy(Donor $donor)
    {
        $donor->delete();
        return response()->json(null, 204);
    }
}
