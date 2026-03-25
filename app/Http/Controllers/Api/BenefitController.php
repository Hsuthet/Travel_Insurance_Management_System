<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Benefit;

class BenefitController extends Controller
{
  
    public function index()
{
  
    $benefitTypes = \App\Models\BenefitType::with('benefits.plan')->get();

    $tableData = $benefitTypes->map(function ($type) {
        $row = [
            'name' => $type->benefittype_name,
            'description' => $type->description,
            'basic' => '-',
            'standard' => '-',
            'premium' => '-',
        ];

        foreach ($type->benefits as $benefit) {
            $planName = strtolower($benefit->plan->plan_name);
            if (array_key_exists($planName, $row)) {
                $row[$planName] = "Up to " . number_format($benefit->max_coverage) . " MMK";
            }
        }
        return $row;
    });

    return response()->json($tableData);
}
}