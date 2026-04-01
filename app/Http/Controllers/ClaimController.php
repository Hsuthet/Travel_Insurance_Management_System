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
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->latest('claim_id')
            ->paginate($request->perPage ?? 5)
            ->withQueryString();

        return Inertia::render('Admin/Claim', [
            'claims'    => $claims,
            'contracts' => Contract::select('contract_id', 'policy_no')->get(),
            'benefits'  => Benefit::all(),
            'plans'     => Plan::all(),
            'filters'   => $request->only(['status', 'perPage']),
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
            'status'               => 'pending',
            'benefit_id'           => 1,
        ]);

        return redirect()->route('admin.claims.index')->with('success', 'Claim submitted successfully!');
    }

    public function edit($id)
    {
        $claim = Claim::with(['contract.customer', 'plan'])->findOrFail($id);

        if ($claim->status !== 'pending') {
            return redirect()->route('admin.claims.index')->with('error', 'Only pending claims can be edited.');
        }

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
                'status'               => $claim->status
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $claim = Claim::findOrFail($id);

        if ($request->has('status')) {
            $claim->update(['status' => $request->status]);
            return redirect()->route('admin.claims.index')->with('success', 'Claim status updated successfully!');
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

        return redirect()->route('admin.claims.index')->with('success', 'Claim updated successfully!');
    }

    public function getContractDetails($policyNo)
    {
        $contract = Contract::where('policy_no', $policyNo)
            ->with(['customer', 'plan'])
            ->first();

        if ($contract && $contract->customer) {
            return response()->json([
                'success'   => true,
                'full_name' => $contract->customer->name,
                'email'     => $contract->customer->email,
                'phone'     => $contract->customer->phone,
                'plan_name' => optional($contract->plan)->plan_name,
                'plan_id'   => $contract->plan_id,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'Contract not found']);
    }

    public function updateStatus(Request $request, $id)
    {
        $claim = Claim::where('claim_id', $id)->firstOrFail();
        $claim->update([
            'status' => $request->status
        ]);

        return redirect()->route('admin.claims.index')->with('success', 'Status is now ' . $claim->status);
    }

    public function destroy($id)
    {
        $claim = Claim::findOrFail($id);
        $claim->delete();

        return redirect()->route('admin.claims.index')->with('success', 'Claim deleted successfully');
    }
}