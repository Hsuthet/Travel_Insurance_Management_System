<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Contract;
use App\Models\Benefit;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClaimController extends Controller
{
    public function index(Request $request)
    {
        $claims = Claim::with(['contract.customer', 'benefit', 'plan'])
            ->when($request->claim_status, function ($query, $claim_status) {
                return $query->where('claim_status', $claim_status);
            })
            ->latest('claim_id')
            ->paginate($request->perPage ?? 5)
            ->withQueryString();

        return Inertia::render('Admin/Claim', [
            'claims'    => $claims,
            'contracts' => Contract::select('contract_id', 'policy_no')->get(),
            'benefits'  => Benefit::all(),
            'plans'     => Plan::all(),
            'filters'   => $request->only(['claim_status', 'perPage']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/ClaimCreate');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'policy_no'     => 'required|exists:contracts,policy_no',
            'plan_id'       => 'required|exists:plans,plan_id',
            'claim_amount'  => 'required|numeric|min:0',
            'accident_date' => 'required|date',
            'description'   => 'required|string',
        ]);

        Claim::create([
            'policy_no'            => $validated['policy_no'],
            'plan_id'              => $validated['plan_id'],
            'claim_amount'         => $validated['claim_amount'],
            'accident_date'        => $validated['accident_date'],
            'accident_description' => $validated['description'],
            'claim_date'           => now(),
            'claim_status'         => 'pending',
            'benefit_id'           => 1,
        ]);

        return redirect()->route('claims.index')->with('success', 'Claim submitted successfully!');
    }

    public function edit($id)
    {
        $claim = Claim::with(['contract.customer', 'plan'])->findOrFail($id);

        return Inertia::render('Admin/ClaimEdit', [
            'claim' => [
                'claim_id'             => $claim->claim_id,
                'policy_no'            => $claim->policy_no,
                'full_name'            => $claim->contract->customer->name,
                'email'                => $claim->contract->customer->email,
                'phone'                => $claim->contract->customer->phone,
                'plan_id'              => $claim->plan_id,
                'accident_date'        => $claim->accident_date,
                'claim_amount'         => $claim->claim_amount,
                'accident_description' => $claim->accident_description,
                'claim_status'         => $claim->claim_status,
                'reject_reason'        => $claim->reject_reason
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $claim = Claim::findOrFail($id);

        if ($request->has('claim_status')) {
            $claim->update(['claim_status' => $request->claim_status]);
            return redirect()->route('claims.index')->with('success', 'Claim status updated successfully!');
        }

        $validated = $request->validate([
            'claim_amount'  => 'required|numeric|min:0',
            'accident_date' => 'required|date',
            'description'   => 'required|string',
        ]);

        $claim->update([
            'claim_amount'         => $validated['claim_amount'],
            'accident_date'        => $validated['accident_date'],
            'accident_description' => $validated['description'],
        ]);

        return redirect()->route('claims.index')->with('success', 'Claim updated successfully!');
    }

    public function getContractDetails($policyNo)
    {
        $contract = Contract::where('policy_no', $policyNo)
            ->with(['customer', 'plan'])
            ->first();

        if ($contract && $contract->customer) {
            $isClaimed = Claim::where('policy_no', $policyNo)
                ->where('claim_status', '!=', 'rejected')
                ->exists();

            $activeStatuses = ['active', 'approved', 'wait pay', 'pending'];
            $dbStatus = strtolower(str_replace('_', ' ', $contract->status));
            $isReallyActive = in_array($dbStatus, $activeStatuses) && !$contract->is_expired;

            return response()->json([
                'success'         => true,
                'is_claimed'      => $isClaimed,
                'status'          => $dbStatus,
                'is_expired'      => (bool)$contract->is_expired,
                'is_really_active' => $isReallyActive,
                'full_name'       => $contract->customer->name,
                'email'           => $contract->customer->email,
                'phone'           => $contract->customer->phone,
                'plan_name'       => optional($contract->plan)->plan_name,
                'plan_id'         => $contract->plan_id,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Contract not found']);
    }

    public function updateclaim_status(Request $request, $id)
    {
        $claim = Claim::where('claim_id', $id)->firstOrFail();

        $data = [
            'claim_status' => $request->claim_status
        ];

        if ($request->has('reject_reason')) {
            $data['reject_reason'] = $request->reject_reason;
        }

        $claim->update($data);

        return redirect()->route('claims.index')->with('success', 'Status updated to ' . $claim->claim_status);
    }

    public function destroy($id)
    {
        $claim = Claim::findOrFail($id);
        $claim->delete();

        return redirect()->route('claims.index')->with('success', 'Claim deleted successfully');
    }
}