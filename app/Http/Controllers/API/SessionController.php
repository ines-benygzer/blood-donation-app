<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Session;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function index()
    {
        return Session::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'location' => 'required|string',
            'date' => 'required|date',
        ]);

        $data = $request->all();
        if (!isset($data['time'])) {
            $data['time'] = '09:00';
        }

        return Session::create($data);
    }

    public function show(Session $session)
    {
        return $session;
    }

    public function update(Request $request, Session $session)
    {
        $session->update($request->all());
        return response()->json($session);
    }

    public function destroy(Session $session)
    {
        $session->delete();
        return response()->json(null, 204);
    }
}
