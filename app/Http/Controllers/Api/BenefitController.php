<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Benefit;

class BenefitController extends Controller
{

     public function index()
    {
        $benefits = Benefit::all();

        return response()->json($benefits);
    }
    
    // GET /api/plans/{plan_id}/benefits
    public function getByPlan($plan_id)
    {
        $benefits = Benefit::where('plan_id', $plan_id)->get();
        return response()->json($benefits);
    }

}