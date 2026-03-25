<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Declaration;
use Illuminate\Http\Request;

class DeclarationController extends Controller
{
    public function getByPlan($plan_id)
    {
        $declarations = Declaration::where('plan_id', $plan_id)->get();

        if ($declarations->isEmpty()) {
            return response()->json(['message' => 'No data found'], 404);
        }

        return response()->json($declarations);
    }
}