<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
   public function index(Request $request)
{
    // 1. Initialize Query
    $query = Contract::with(['customer', 'plan', 'claims']);

    // 2. Status filter - Handle casing to match React values
    if ($request->filled('status') && $request->status !== 'Status') {
        $statusValue = strtolower($request->status);

        if ($statusValue === 'claimed') {
            $query->whereHas('claims');
        } elseif ($statusValue === 'expired') {
            // Note: If you run the auto-scheduler we built earlier, 
            // you might just need to check where status is 'expired'.
            $query->where('status', 'expired');
        } else {
            // This handles 'active', 'pending', 'wait_pay', etc.
            $query->where('status', $statusValue);
        }
    }

    // 3. Claim Status filter
    if ($request->filled('claimStatus') && $request->claimStatus !== 'Claim Status') {
        if ($request->claimStatus === 'No Claim') {
            $query->doesntHave('claims');
        } elseif ($request->claimStatus === 'Claimed') {
            $query->whereHas('claims');
        } else {
            $query->whereHas('claims', function ($q) use ($request) {
                $q->where('claim_status', strtolower($request->claimStatus));
            });
        }
    }

    // 4. Date filters
    if ($request->filled('startDate')) {
        $query->whereDate('created_at', '>=', $request->startDate);
    }
    if ($request->filled('endDate')) {
        $query->whereDate('created_at', '<=', $request->endDate);
    }

    // 5. Pagination
    $perPage = $request->input('per_page', 10);
    $contracts = $query->latest()
        ->paginate($perPage)
        ->withQueryString();

    // 6. Return response
    if ($request->wantsJson() || $request->is('api/*')) {
        return response()->json([
            'status' => true,
            'contracts' => $contracts,
        ]);
    }

    return Inertia::render('Admin/ContractList', [
        'contracts' => $contracts,
        // Make sure to include claimStatus in the filters sent back to React
        'filters' => $request->only(['status', 'claimStatus', 'startDate', 'endDate']),
    ]);
}

    public function confirm($id)
    {
        $contract = Contract::findOrFail($id);
        $contract->update(['status' => 'Active']);

        return redirect()->route('admin.contracts.index')
            ->with('message', 'Contract confirmed successfully.');
    }

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

   
    public function show($id)
    {

        $contract = Contract::with(['customer', 'beneficiary'])->findOrFail($id);

        return Inertia::render('Admin/ContractDetail', [
            'contract' => $contract,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
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
