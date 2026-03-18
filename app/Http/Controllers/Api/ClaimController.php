<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;

class ClaimController extends Controller
{
    public function store(Request $request)
    {
        $claim = Claim::create([
            'contract_id' => $request->contract_id,
            'claim_date' => now(),
            'claim_amount' => $request->claim_amount,
            'accident_date' => $request->accident_date,
            'accident_description' => $request->accident_description,
            'benefit_id' => $request->benefit_id,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Claim submitted',
            'claim' => $claim
        ]);
    }
}