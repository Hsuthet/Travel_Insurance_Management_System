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
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Exception;
use App\Models\Plan;
use Carbon\Carbon;

class ContractController extends Controller
{
    public function apply(Request $request)
    {
        // 1. Enhanced Validation
        $rules = [
            'customer_info.name'  => 'required|string|min:3',
            'customer_info.email' => 'required|email',
            'customer_info.phone' => ['required', 'regex:/^(09|\+959)\d{7,9}$/'],
            'customer_info.dob'   => 'required|date',
            'customer_info.nrc'   => 'required|string', 
            'plan_id'             => 'required|exists:plans,plan_id',
            'start_date'          => 'required|date|after_or_equal:today',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'destination'         => 'required|string',
            'vehicle'             => 'nullable|string',
            'trip_type'           => 'nullable|string',
            'results'             => 'required|array', 
            'results.*.declaration_id' => 'required|exists:declarations,declaration_id',
            'results.*.checked'        => 'required|boolean',
        ];

        // Conditional Beneficiary Validation for Premium Plan (ID 3)
        if ($request->plan_id == 3) {
            $rules['beneficiary_info']              = 'required|array';
            $rules['beneficiary_info.name']         = 'required|string';
            $rules['beneficiary_info.phone']        = ['required', 'regex:/^(09|\+959)\d{7,9}$/'];
            $rules['beneficiary_info.relationship'] = 'required|string';
        }

    $request->validate($rules);
    $customerData = $request->customer_info;
$nrcFormatted = $customerData['nrcState'] . '/' . ($customerData['nrcTownship'] ?? '') . 
                '(' . ($customerData['nrcType'] ?? 'N') . ')' . $customerData['nrcNumber'];


$existingCustomer = Customer::where('nrc', $nrcFormatted)
    ->where('email', $customerData['email'])
    ->where('phone', $customerData['phone'])
    ->first();

if ($existingCustomer) {
    
    $duplicateContract = Contract::where('customer_id', $existingCustomer->customer_id)
        ->where('destination', $request->destination)
        ->where('start_date', $request->start_date)
        ->where('end_date', $request->end_date)
        ->where('vehicle', $request->vehicle ?? null)
        ->whereIn('status', ['pending', 'wait_pay', 'approved']) 
        ->first();

    if ($duplicateContract) {
        return response()->json([
            'status'  => false,
            'message' => 'Submission Already Exist'
        ], 400); 
    }
}

    DB::beginTransaction();
    try {
        
        $customerData = $request->customer_info;
        $imagePath = null;

       
        if (!empty($customerData['tripTicket']) && str_contains($customerData['tripTicket'], 'base64')) {
            $imageData = $customerData['tripTicket'];
            $replace = substr($imageData, 0, strpos($imageData, ',') + 1);
            $image = str_replace($replace, '', $imageData);
            $image = str_replace(' ', '+', $image);
            
            $extension = explode('/', explode(':', substr($imageData, 0, strpos($imageData, ';')))[1])[1];
            $imageName = 'ticket_' . time() . '_' . uniqid() . '.' . $extension;

           
            Storage::disk('public')->put('tickets/' . $imageName, base64_decode($image));
            $imagePath = 'tickets/' . $imageName;
        }

      
        $nrcFormatted = null;
        if (isset($customerData['nrcState']) && isset($customerData['nrcNumber'])) {
            $nrcFormatted = $customerData['nrcState'] . '/' . 
                            ($customerData['nrcTownship'] ?? '') . '(' . 
                            ($customerData['nrcType'] ?? 'N') . ')' . 
                            $customerData['nrcNumber'];
        }

        
        $customer = Customer::create([
            'name'        => $customerData['name'],
            'email'       => $customerData['email'],
            'phone'       => $customerData['phone'],
            'dob'         => $customerData['dob'],
            'gender'      => $customerData['gender'] ?? 'Female',
            'nrc'         => $nrcFormatted,
            'passport'    => $customerData['passport'] ?? null,
            'occupation'  => $customerData['occupation'] ?? 'Other',
            'address'     => $customerData['address'] ?? null,
            'ticket_image' => $imagePath, 
        ]);

       
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

            // 7. Calculate Premium
            $plan = Plan::where('plan_id', $request->plan_id)->firstOrFail();
            $startDate = Carbon::parse($request->start_date);
            $endDate   = Carbon::parse($request->end_date);
            $days      = $startDate->diffInDays($endDate) + 1;
            $totalPremium = $plan->daily_rate * $days;

            // 8. Save Contract
            $contract = Contract::create([
                'contract_id'    => $this->generateContractId(),
                'customer_id'    => $customer->customer_id,
                'beneficiary_id' => $beneficiaryId,
                'plan_id'        => $request->plan_id,
                'trip_type'      => $request->trip_type ?? 'single',
                'start_date'     => $request->start_date,
                'end_date'       => $request->end_date,
                'destination'    => $request->destination,
                'vehicle'        => $request->vehicle ?? null,
                'premium_amount' => $totalPremium,
                'payment_token'  => $request->payment_token,
                // 'ticket_image'   => $ticketPath,
                'status'         => 'pending', 
            ]);

            // 9. Save Declaration Results
           foreach ($request->results as $row) {
                // Manually check if it exists based on your unique criteria
                $exists = DeclarationResult::where('customer_id', $customer->customer_id)
                    ->where('declaration_id', $row['declaration_id'])
                    ->first();

                if ($exists) {
                    // If it exists, update it manually without relying on 'id'
                    DeclarationResult::where('customer_id', $customer->customer_id)
                        ->where('declaration_id', $row['declaration_id'])
                        ->update(['check_result' => $row['checked']]);
                } else {
                    // Otherwise, create a new record
                    DeclarationResult::create([
                        'customer_id'    => $customer->customer_id,
                        'declaration_id' => $row['declaration_id'],
                        'check_result'   => $row['checked']
                    ]);
                }
            }

        DB::commit();
return response()->json([
    'status' => true,      // 'success' အစား true လို့ ရေးပါ
    'contract_id' => $contract->contract_id
], 201);

        } catch (Exception $e) {
    DB::rollBack();
    Log::error('Apply Error: ' . $e->getMessage());

    return response()->json([
        'status'  => false,   
        'message' => 'Submission Fails!!!'
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

private function generateContractId()
{
    $year = date('Y'); 
    $prefix = "CON-" . $year . "-";

    // Use latest() on the primary key to ensure we get the absolute newest record
    $latestContract = Contract::where('contract_id', 'LIKE', $prefix . '%')
        ->select('contract_id') 
        ->orderBy('contract_id', 'desc')
        ->first();

    if (!$latestContract) {
        return $prefix . "0001";
    }

    // Clean the string to ensure no whitespace is breaking the substr
    $currentId = trim($latestContract->contract_id);
    
    // Extract the number from the end
    $lastNumber = (int) substr($currentId, -4);
    $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);

    return $prefix . $newNumber;
}
}