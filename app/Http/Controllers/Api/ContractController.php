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
use Inertia\Inertia;
use Exception;

class ContractController extends Controller
{
    public function apply(Request $request)
    {
        // Validation
        $rules = [
            'customer_info.name'  => 'required|string|min:3',
            'customer_info.email' => 'required|email',
            'customer_info.phone' => ['required', 'regex:/^(09|\+959)\d{7,9}$/'],
            'customer_info.dob'   => 'required|date',
            'plan_id'             => 'required|exists:plans,plan_id',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'results'             => 'required|array', 
            'results.*.declaration_id' => 'required|exists:declarations,declaration_id',
            'results.*.checked'        => 'required|boolean',
        ];

        if ($request->plan_id == 3) {
            $rules['beneficiary_info']              = 'required|array';
            $rules['beneficiary_info.name']         = 'required|string';
            $rules['beneficiary_info.phone']        = ['required', 'regex:/^(09|\+959)\d{7,9}$/'];
            $rules['beneficiary_info.relationship'] = 'required|string';
        }

        $request->validate($rules);

        DB::beginTransaction();

        try {
            //  Save Customer
            $customer = Customer::create($request->customer_info);

            //  File Upload
            $cancelPath = null;
            if ($request->hasFile('ticket_image')) {
                $cancelPath = $request->file('ticket_image')->store('contracts/cancellation', 'public');
            }

            //  Save Beneficiary (if exists)
            $beneficiaryId = null;
            if ($request->has('beneficiary_info')) {
                $beneficiary = Beneficiary::create([
                    'customer_id'  => $customer->customer_id,
                    'name'         => $request->beneficiary_info['name'],
                    'phone'        => $request->beneficiary_info['phone'],
                    'relationship' => $request->beneficiary_info['relationship'],
                    'nrc'          => $request->beneficiary_info['nrc'] ?? null,
                    'passport'     => $request->beneficiary_info['passport'] ?? null,
                ]);
                $beneficiaryId = $beneficiary->beneficiary_id;
            }

            //  Calculate premium
            $plan = \App\Models\Plan::findOrFail($request->plan_id);
            $startDate = \Carbon\Carbon::parse($request->start_date);
            $endDate   = \Carbon\Carbon::parse($request->end_date);
            $days      = $startDate->diffInDays($endDate) + 1;
            $totalPremium = $plan->daily_rate * $days;

            //  Save Contract (PENDING)
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
                'status'         => 'pending', 
            ]);

            //  Save Declaration Results
            foreach ($request->results as $row) {
                DeclarationResult::updateOrCreate(
                    [
                        'customer_id'    => $customer->customer_id,
                        'declaration_id' => $row['declaration_id']
                    ],
                    [
                        'check_result'   => $row['checked']
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'status'      => 'success',
                'message'     => 'Application submitted successfully',
                'contract_id' => $contract->contract_id
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();

            Log::error('Apply Error: ' . $e->getMessage());

            return response()->json([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }


/**
 * Admin Approves the application
 */
public function approve($id)
{
    $contract = Contract::findOrFail($id);
    
    if ($contract->status !== 'pending') {
        return response()->json(['message' => 'Only pending contracts can be approved'], 400);
    }

    $contract->update(['status' => 'wait_pay']);
    
    return response()->json(['message' => 'Contract approved. Waiting for payment.']);
}

/**
 * Admin Rejects the application
 */
public function reject($id)
{
    $contract = Contract::findOrFail($id);
    $contract->update(['status' => 'rejected']);
    
    return response()->json(['message' => 'Contract rejected.']);
}

/**
 * Admin Cancels an existing contract
 */
public function cancel($id)
{
    $contract = Contract::findOrFail($id);
    $contract->update(['status' => 'canceled']);
    
    return response()->json(['message' => 'Contract has been canceled.']);
}
}