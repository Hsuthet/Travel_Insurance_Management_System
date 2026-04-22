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
   
    public function index(Request $request)
{
    $query = Contract::with(['customer', 'plan', 'claims']); 

    // Status filter
    if ($request->filled('status') && $request->status !== 'Status') {
        if ($request->status === 'claimed') {
            $query->whereHas('claims'); 
        } elseif ($request->status === 'expired') {
            $query->where('status', 'approved')
                  ->whereDate('end_date', '<', now());
        } else {
            $query->where('status', $request->status);
        }
    }
    if ($request->filled('claimStatus') && $request->claimStatus !== 'Claim Status') {

    if ($request->claimStatus === 'No Claim') {
        $query->doesntHave('claims');
    } else {
        $query->whereHas('claims', function ($q) use ($request) {
            $q->where('claim_status', strtolower($request->claimStatus));
        });
    }
}
    // Date filters
    if ($request->filled('startDate')) {
        $query->whereDate('created_at', '>=', $request->startDate);
    }
    if ($request->filled('endDate')) {
        $query->whereDate('created_at', '<=', $request->endDate);
    }

    // ✅ Correct pagination
    $perPage = $request->input('per_page', 10);

    $contracts = $query->latest()
        ->paginate($perPage)
        ->withQueryString();

    // API response
    if ($request->wantsJson() || $request->is('api/*')) {
        return response()->json([
            'status' => true,
            'contracts' => $contracts
        ]);
    }

    return Inertia::render('Admin/ContractList', [
        'contracts' => $contracts,
        'filters' => $request->only(['status', 'startDate', 'endDate']),
    ]);
}

    public function apply(Request $request)
{
    // 1. Initial Validation
    $rules = [
        'customer_info.name'       => 'required|string|min:3',
        'customer_info.email'      => 'required|email',
        'customer_info.phone'      => ['required', 'regex:/^(09|\+959)\d{7,9}$/'],
        'customer_info.dob'        => 'required|date',
        'customer_info.nrcState'   => 'required',
        'customer_info.nrcNumber'  => 'required',
        'plan_id'                  => 'required|exists:plans,plan_id',
        'payment_token'            => 'required|string',
        'start_date'               => 'required|date|after_or_equal:today',
        'end_date'                 => 'required|date|after_or_equal:start_date',
        'destination'              => 'required|string',
        'vehicle'                  => 'required|string',
        'results'                  => 'required|array',
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

    //  2. Plan-Specific Declaration Validation
    $planId = $request->plan_id;
   $requiredDeclarations = [
        1 => range(1, 4),   // IDs 1, 2, 3, 4
        2 => range(1, 8),   // IDs 1 through 8
        3 => range(1, 12)   // IDs 1 through 12
    ];

    $targetIds = $requiredDeclarations[$planId] ?? [];
    $submittedResults = collect($request->results);

    foreach ($targetIds as $id) {
        $found = $submittedResults->where('declaration_id', $id)->first();
        if (!$found || $found['checked'] == false) {
            return response()->json([
                'status'  => false,
                'message' => "Application rejected. Requirement for Plan $planId (Declaration $id) not met."
            ], 422);
        }
    }

    DB::beginTransaction();
    try {
        $customerData = $request->customer_info;

        // 3. Format NRC String
        $nrcFormatted = $customerData['nrcState'] . '/' . ($customerData['nrcTownship'] ?? '') .
                        '(' . ($customerData['nrcType'] ?? 'N') . ')' . $customerData['nrcNumber'];

        $customer = Customer::where('nrc', $nrcFormatted)->first();

        // 4. Duplicate Check
        if ($customer) {
            $duplicateContract = Contract::where('customer_id', $customer->customer_id)
                ->where('destination', $request->destination)
                ->where('start_date', $request->start_date)
                ->where('end_date', $request->end_date)
                ->whereIn('status', ['pending', 'wait_pay', 'approved'])
                ->first();

            if ($duplicateContract) {
                DB::rollBack();
                return response()->json([
                    'status'  => false,
                    'message' => 'Submission Already Exist'
                ], 400);
            }

            // Update existing customer profile
            $customer->update([
                'name'       => $customerData['name'],
                'email'      => $customerData['email'],
                'phone'      => $customerData['phone'],
                'dob'        => $customerData['dob'],
                'gender'     => $customerData['gender'] ?? $customer->gender,
                'passport'   => $customerData['passport'] ?? $customer->passport,
                'occupation' => $customerData['occupation'] ?? $customer->occupation,
                'address'    => $customerData['address'] ?? $customer->address,
            ]);
        } else {
            // Create new customer
            $customer = Customer::create([
                'name'       => $customerData['name'],
                'email'      => $customerData['email'],
                'phone'      => $customerData['phone'],
                'dob'        => $customerData['dob'],
                'gender'     => $customerData['gender'] ?? 'Female',
                'nrc'        => $nrcFormatted,
                'passport'   => $customerData['passport'] ?? null,
                'occupation' => $customerData['occupation'] ?? 'Other',
                'address'    => $customerData['address'] ?? null,
            ]);
        }

        // 5. Image Handling
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
            $customer->update(['ticket_image' => $imagePath]);
        }

// 6. Beneficiary Logic
$beneficiaryId = null;
if ($request->has('beneficiary_info') && !empty($request->beneficiary_info['name'])) {
    $bData = $request->beneficiary_info;

    $beneficiaryNrc = null;

    // Check if frontend sent the ALREADY formatted string
    if (isset($bData['nrc']) && !empty($bData['nrc'])) {
        $beneficiaryNrc = $bData['nrc'];
    } 
    // Fallback: If frontend sent raw parts (nrcState, nrcNumber, etc.)
    elseif (isset($bData['nrcState']) && isset($bData['nrcNumber'])) {
        $beneficiaryNrc = $bData['nrcState'] . '/' . ($bData['nrcTownship'] ?? '') .
                          '(' . ($bData['nrcType'] ?? 'N') . ')' . $bData['nrcNumber'];
    }

    $beneficiary = Beneficiary::create([
        'customer_id'  => $customer->customer_id,
        'name'         => $bData['name'],
        'phone'        => $bData['phone'] ?? $customer->phone,
        'relationship' => $bData['relationship'] ?? 'Self',
        'nrc'          => $beneficiaryNrc, 
    ]);
    $beneficiaryId = $beneficiary->beneficiary_id;
}
        // 7. Calculate Premium
        $plan = Plan::where('plan_id', $request->plan_id)->firstOrFail();
        $days = Carbon::parse($request->start_date)->diffInDays(Carbon::parse($request->end_date)) + 1;
        $totalPremium = $plan->daily_rate * $days;

        // 8. Create Contract (REMOVED 'nrc' column from here)
        $contract = Contract::create([
            'contract_id'    => $this->generateContractId(),
            'customer_id'    => $customer->customer_id,
            'beneficiary_id' => $beneficiaryId,
            'plan_id'        => $request->plan_id,
            'trip_type'      => $request->trip_type ?? 'single',
            'start_date'     => $request->start_date,
            'end_date'       => $request->end_date,
            'destination'    => $request->destination,
            'vehicle'        => $request->vehicle,
            'premium_amount' => $totalPremium,
            'payment_token'  => $request->payment_token,
            'status'         => 'pending',

        ]);

        // 9. Save All Declaration Results
        foreach ($request->results as $row) {
            DeclarationResult::updateOrCreate(
                [
                    'customer_id'    => $customer->customer_id,
                    'declaration_id' => $row['declaration_id']
                ],
                ['check_result' => $row['checked']]
            );
        }

        DB::commit();
        return response()->json([
            'status' => true,
            'contract_id' => $contract->contract_id
        ], 201);

    
    
    
    
    
        } catch (Exception $e) {
        DB::rollBack();
        Log::error('Apply Error: ' . $e->getMessage());
        return response()->json([
            'status'  => false,
            'message' => 'Submission Fails: ' . $e->getMessage()
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

public function show($id)
{

    $contract = Contract::with(['customer', 'beneficiary'])->findOrFail($id);

    return Inertia::render('Admin/ContractDetail', [
        'contract' => $contract,
    ]);
}

public function updateStatus(Request $request, $id) {
    $contract = Contract::findOrFail($id);

    // Prevent moving to 'approved' if the date has already passed
    if ($request->status === 'approved' && $contract->is_expired) {
        return back()->with('error', 'Cannot approve an expired contract.');
    }

    $contract->status = $request->status;
    $contract->save();

    return back()->with('success', 'Status updated successfully!');
}
}