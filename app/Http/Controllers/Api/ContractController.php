<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Beneficiary;
use App\Models\DeclarationResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ContractController extends Controller
{
    public function apply(Request $request)
{
    // ၁။ Validation မှာ occupation ကို nullable ထည့်ပေးထားပါ
    $rules = [
        'customer_info.name'  => 'required|string|min:3',
        'customer_info.email' => 'required|email',
        'customer_info.phone' => 'required',
        'customer_info.dob'   => 'required|date',
        'plan_id'             => 'required|exists:plans,plan_id',
        'start_date'          => 'required|date',
        'end_date'            => 'required|date|after_or_equal:start_date',
        'results'             => 'required|array', 
    ];

    $request->validate($rules);

    DB::beginTransaction();
    try {
        // ၂။ Save Customer (Occupation null မဖြစ်အောင် default ထည့်ပေးခြင်း)
        $customerData = $request->customer_info;
        if (!isset($customerData['occupation']) || empty($customerData['occupation'])) {
            $customerData['occupation'] = 'Other'; 
        }
        $customer = Customer::create($customerData);

        // ၃။ Beneficiary Info (Null Check သေချာလုပ်ခြင်း)
        $beneficiaryId = null;
        if ($request->has('beneficiary_info') && is_array($request->beneficiary_info) && !empty($request->beneficiary_info['name'])) {
            $beneficiary = Beneficiary::create([
                'customer_id'  => $customer->customer_id,
                'name'         => $request->beneficiary_info['name'],
                'phone'        => $request->beneficiary_info['phone'] ?? $customer->phone,
                'relationship' => $request->beneficiary_info['relationship'] ?? 'Self',
                'nrc'          => $request->beneficiary_info['nrc'] ?? null,
            ]);
            $beneficiaryId = $beneficiary->beneficiary_id;
        }

        // ၄။ Save Contract
        $plan = \App\Models\Plan::findOrFail($request->plan_id);
        $startDate = \Carbon\Carbon::parse($request->start_date);
        $endDate   = \Carbon\Carbon::parse($request->end_date);
        $days      = $startDate->diffInDays($endDate) + 1;
        $totalPremium = $plan->daily_rate * $days;

        $contract = Contract::create([
            'customer_id'    => $customer->customer_id,
            'beneficiary_id' => $beneficiaryId,
            'plan_id'        => $request->plan_id,
            'policy_no'      => null,
            'trip_type'      => $request->trip_type ?? 'single',
            'start_date'     => $request->start_date,
            'end_date'       => $request->end_date,
            'destination'    => $request->destination,
            'premium_amount' => $totalPremium,
            'status'         => 'pending',
        ]);

        // ၅။ Save Declaration Results (Safety loop)
        if (is_array($request->results)) {
            foreach ($request->results as $row) {
                // array offset check လုပ်ပါ
                if (isset($row['declaration_id'])) {
                    DeclarationResult::updateOrCreate(
                        [
                            'customer_id'    => $customer->customer_id,
                            'declaration_id' => $row['declaration_id']
                        ],
                        [
                            'check_result'   => $row['checked'] ?? false
                        ]
                    );
                }
            }
        }

        DB::commit();
        return response()->json(['status' => 'success', 'contract_id' => $contract->contract_id], 201);

    } catch (Exception $e) {
        DB::rollBack();
        Log::error('Apply Error: ' . $e->getMessage());
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}
}