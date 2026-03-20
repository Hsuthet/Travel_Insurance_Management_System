<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Beneficiary;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class ContractController extends Controller
{
     public function index()
    {
        $contracts = Contract::all();

        return response()->json($contracts);
    }

    public function apply(Request $request)
    {
           // 1. Validation Rules

            $rules = [
                'customer_info.name'  => 'required|string|min:3',
                'customer_info.email' => 'required|email',
                'customer_info.phone' => ['required', 'regex:/^(09|\+959)\d{7,9}$/'],
                'customer_info.dob'   => 'required|date',
                'plan_id'             => 'required|exists:plans,plan_id',
                'start_date'          => 'required|date',
                'end_date'            => 'required|date|after_or_equal:start_date',
            ];

            // 2. Conditional Rules for Plan 3
            if ($request->plan_id == 3) {
                $rules['beneficiary_info']              = 'required|array'; // FIXED THIS LINE
                $rules['beneficiary_info.name']         = 'required|string';
                $rules['beneficiary_info.phone']        = ['required', 'regex:/^(09|\+959)\d{7,9}$/'];
                $rules['beneficiary_info.relationship'] = 'required|string';
            }
                    
            // 3. Custom Error Messages for Debugging
            $messages = [
                'plan_id.exists'                => 'Debug: The selected Plan ID does not exist in the database.',
                'beneficiary_info.required' => 'DEBUG ERROR: Plan 3 selected but beneficiary_info object is missing from JSON.',
                'beneficiary_info.name.required' => 'Debug: Beneficiary Name is missing but required for Plan 3.',
                'end_date.after_or_equal'       => 'Debug: End date cannot be before the start date.',
            ];

            $request->validate($rules, $messages);

            // 4. Database Transaction for Safety
            DB::beginTransaction();

            try {
                // Save Customer
                $customer = Customer::create($request->customer_info);

                // Handle File Upload
                $cancelPath = null;
                if ($request->hasFile('ticket_image')) {
                    $cancelPath = $request->file('ticket_image')->store('contracts/cancellation', 'public');
                }

            // Save Beneficiary (Including NRC/Passport for Plan 3)
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

            // Calculation
            $plan = \App\Models\Plan::findOrFail($request->plan_id);
            $startDate = \Carbon\Carbon::parse($request->start_date);
            $endDate = \Carbon\Carbon::parse($request->end_date);
            $days = $startDate->diffInDays($endDate) + 1;
            $totalPremium = $plan->daily_rate * $days;

            // Save Contract
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
                'nrc'            => $request->customer_info['nrc'] ?? null,
                'passport'       => $request->customer_info['passport'] ?? null,
                'ticket_image'   => $cancelPath,
                'status'         => 'active'
            ]);

            DB::commit();

            return response()->json([
                'status'  => 'success',
                'message' => 'Application submitted successfully',
                'policy_no' => $contract->policy_no
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
           
            Log::error('Insurance Application Error: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Debug Error: ' . $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}