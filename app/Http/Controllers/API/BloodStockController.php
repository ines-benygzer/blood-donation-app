<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BloodStock;
use Illuminate\Http\Request;

class BloodStockController extends Controller
{
    public function index()
    {
        return BloodStock::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'blood_type' => 'required|string|unique:blood_stocks',
            'quantity' => 'required|integer|min:0',
        ]);

        return BloodStock::create($request->all());
    }

    public function update(Request $request, BloodStock $bloodStock)
    {
        $bloodStock->update($request->all());
        return response()->json($bloodStock);
    }
}
