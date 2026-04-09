<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\Contract;
use Carbon\Carbon;
use Exception; // Import the Exception class
use Illuminate\Support\Facades\Log;

class ClaimController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'contract_id'   => 'required|exists:contracts,contract_id',
                'claim_amount'  => 'required|numeric',
                'accident_date' => 'required|date',
                'benefit_id'    => 'required|exists:benefits,benefit_id',
            ]);

            // Use where() because contract_id is likely a custom string ID
            $contract = Contract::where('contract_id', $request->contract_id)->firstOrFail();

            // 1. Check if status is Active
            if ($contract->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot claim. Your contract status is: {$contract->status}"
                ], 403);
            }

            // 2. Check for Expiration
            $accidentDate = Carbon::parse($request->accident_date);
            $endDate = Carbon::parse($contract->end_date);

            if ($accidentDate->gt($endDate)) {
                $contract->update(['status' => 'expired']);
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot claim. The accident occurred after the contract expired.'
                ], 403);
            }

            // 3. Create the claim
            $claim = Claim::create([
                'contract_id'          => $request->contract_id,
                'plan_id'              => $contract->plan_id,
                'claim_date'           => now(),
                'claim_amount'         => $request->claim_amount,
                'accident_date'        => $request->accident_date,
                'accident_description' => $request->accident_description,
                'benefit_id'           => $request->benefit_id,
                'status'               => 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Claim submitted successfully',
                'claim'   => $claim
            ], 201);

        } catch (Exception $e) {
            // Log the error to storage/logs/laravel.log
            Log::error("Claim Store Error: " . $e->getMessage());

            // Return the specific error message to Postman for easy tracing
            return response()->json([
                'success' => false,
                'message' => 'Internal Server Error',
                'debug_error' => $e->getMessage(), // This tells you EXACTLY what failed
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}