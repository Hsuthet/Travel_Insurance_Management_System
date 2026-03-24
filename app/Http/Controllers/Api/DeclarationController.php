<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Declaration;

class DeclarationController extends Controller
{
   // GET /api/plans/{plan_id}/declarations
    public function getByPlan($plan_id)
    {
        $declarations = Declaration::where('plan_id', $plan_id)->get();
 
        if ($declarations->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
        }
        return response()->json($declarations);
    }
}