<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\Contract;
use Illuminate\Support\Facades\DB;

class ClaimController extends Controller
{
   public function store(Request $request)
{
    $request->validate([
        'contract_id' => 'required|exists:contracts,contract_id',
        'claim_amount' => 'required|numeric',
        'accident_date' => 'required|date',
        'benefit_id' => 'required|exists:benefits,benefit_id',
    ]);

    $contract = Contract::findOrFail($request->contract_id);

    // 1. Check if status is Active
    if ($contract->status !== 'active') {
        return response()->json([
            'message' => "Cannot claim. Your contract status is: {$contract->status}"
        ], 403);
    }

    // 2. Check for Expiration (Auto-expire if accident_date > end_date)
    $accidentDate = \Carbon\Carbon::parse($request->accident_date);
    $endDate = \Carbon\Carbon::parse($contract->end_date);

    if ($accidentDate->gt($endDate)) {
        // Optional: Update status to expired if it hasn't been updated yet
        $contract->update(['status' => 'expired']);

        return response()->json([
            'message' => 'Cannot claim. The accident occurred after the contract expired.'
        ], 403);
    }

    // 3. Create the claim
    $claim = Claim::create([
        'contract_id' => $request->contract_id,
        'claim_date' => now(),
        'claim_amount' => $request->claim_amount,
        'accident_date' => $request->accident_date,
        'accident_description' => $request->accident_description,
        'benefit_id' => $request->benefit_id,
        'claim_status' => 'pending'
    ]);

    return response()->json([
        'message' => 'Claim submitted successfully',
        'claim' => $claim
    ]);
}
}