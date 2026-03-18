<?php

namespace App\Http\Controllers\Api;

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Beneficiary;

class ContractController extends Controller
{
  // POST /api/apply
    public function apply(Request $request)
{
    // 1. Validation Rules
    $rules = [
        'customer_info.name'  => 'required|string',
        'customer_info.email' => 'required|email',
        'customer_info.dob'   => 'required|date',
        'plan_id'             => 'required|exists:plans,plan_id',
        'start_date'          => 'required|date',
        'end_date'            => 'required|date',
        'customer_info.nrc' => 'nullable|string',
        'customer_info.passport' => 'nullable|string',
        'ticket_image'         => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
    ];

    // Premium Plan (ID = 3) 
    if ($request->plan_id == 3) {
        $rules['beneficiary_info.name']         = 'required|string';
        $rules['beneficiary_info.relationship'] = 'required|string';
        $rules['beneficiary_info.phone']        = 'required|string';
    }

    $request->validate($rules);

    //2. Save Customer
   
    $customer = Customer::create($request->customer_info);

    $cancelPath = null;
    if ($request->hasFile('ticket_image')) {
        // storage/app/public/contracts/cancellation 
        $cancelPath = $request->file('ticket_image')->store('contracts/cancellation', 'public');
    }
    // 3.Save Beneficiary
    $beneficiaryId = null;
    if ($request->has('beneficiary_info')) {
        $beneficiary = Beneficiary::create($request->beneficiary_info);
        $beneficiaryId = $beneficiary->beneficiary_id;
    }

    //4.Premium Amount Calculation
    $plan = \App\Models\Plan::findOrFail($request->plan_id);
    $startDate = \Carbon\Carbon::parse($request->start_date);
    $endDate = \Carbon\Carbon::parse($request->end_date);
    
    
    $days = $startDate->diffInDays($endDate) + 1;
    $totalPremium = $plan->daily_rate * $days;

    // 5. Save Contract 
    $contract = Contract::create([
        'customer_id'    => $customer->customer_id, 
        'beneficiary_id' => $beneficiaryId,
        'plan_id'        => $request->plan_id,
        'trip_type'      => $request->trip_type ?? 'single', 
        'start_date'     => $request->start_date,
        'end_date'       => $request->end_date,
        'destination'    => $request->destination,
        'vehicle'        => $request->vehicle ?? null,
        'premium_amount' => $totalPremium,
        'nrc'        => $request->customer_info['nrc'] ?? null,
        'passport'   => $request->cusormer_info['passport']??null,
        'ticket_image'  => $cancelPath,
        'status'         => 'active'
    ]);

    // 6.Response
    return response()->json([
        'status'  => 'success',
        'message' => 'Insurance application submitted successfully',
        'data'    => [
            'policy_no'    => $contract->policy_no,
            'customer_name' => $customer->name,
            'total_days'   => $days,
            'total_amount' => $totalPremium,
            'status'       => $contract->status,
            'ticket_image' => $cancelPath ? asset('storage/' . $cancelPath) : null
        ]
    ], 201);
}
}