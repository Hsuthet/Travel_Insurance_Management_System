<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB; 
use App\Models\Declaration;
use App\Models\DeclarationResult; 

class DeclarationController extends Controller
{
    // GET /api/plans/{plan_id}/declarations
    public function getByPlan($plan_id)
    {
        //  Validate that declarations exist for this plan
        $declarations = Declaration::where('plan_id', $plan_id)->get();
        
        if ($declarations->isEmpty()) {
            return response()->json(['message' => 'No declarations found for this plan.'], 404);
        }

        return response()->json($declarations);
    }

    public function storeResults(Request $request)
{
    // 1. Validation
    $request->validate([
        'customer_id' => 'required|exists:customers,customer_id',
        'results'     => 'required|array',
        'results.*.declaration_id' => 'required|exists:declarations,declaration_id',
        'results.*.checked'        => 'required|boolean',
    ]);

    // 2. Database Transaction
    return DB::transaction(function () use ($request) {
        
        foreach ($request->results as $row) {
            
            DeclarationResult::updateOrCreate(
                [
                    'customer_id'    => $request->customer_id,
                    'declaration_id' => $row['declaration_id']
                ],
                [
                    'check_result'   => $row['checked']
                ]
            );
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Declarations saved  successfully.'
        ], 201);
    });
}
}