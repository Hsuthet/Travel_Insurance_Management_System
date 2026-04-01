<?php

namespace App\Http\Controllers;
use App\Models\Contract;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
//     public function index(Request $request)
// {
//     // 1. Initialize the query WITH the relationship
//     // Note: We include 'customer_id' so Laravel can link the two tables
//     $query = Contract::with(['customer:customer_id,name']);

//     // 2. Filter by Status
//     if ($request->filled('status')) {
//         // Use the raw request value; ensure it matches your DB casing
//         $query->where('status', $request->status); 
//     }

//     // 3. Filter by Date Range (Applied Date)
//     if ($request->filled('startDate')) {
//         $query->whereDate('applied_date', '>=', $request->startDate);
//     }

//     if ($request->filled('endDate')) {
//         $query->whereDate('applied_date', '<=', $request->endDate);
//     }

//     // 4. Finalize the query with sorting and pagination
//     $contracts = $query->latest()
//         ->paginate(10)
//         ->withQueryString();

//     // 5. Render to Inertia
//     return Inertia::render('Admin/ContractList', [
//         'contracts' => $contracts,
//         'filters' => $request->only(['status', 'startDate', 'endDate']),
//     ]);
// }

public function index(Request $request)
{
    // 1. Start the query with the relationship
    $query = Contract::with(['customer:customer_id,name']);

    // 2. Filter by Status
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // 3. Filter by Date Range
    if ($request->filled('startDate')) {
        $query->whereDate('applied_date', '>=', $request->startDate);
    }
    if ($request->filled('endDate')) {
        $query->whereDate('applied_date', '<=', $request->endDate);
    }

    // 4. Finalize: Order by latest and Paginate
    $contracts = $query->latest()->paginate(10)->withQueryString();

    return Inertia::render('Admin/ContractList', [
        'contracts' => $contracts,
        'filters' => $request->only(['status', 'startDate', 'endDate']),
    ]);
}

public function show($id)
{
    
    $contract = Contract::with(['customer', 'beneficiary'])->findOrFail($id);

    return Inertia::render('Admin/ContractDetail', [
        'contract' => $contract,
    ]);
}
public function confirm($id)
{
    $contract = Contract::findOrFail($id);
    $contract->update(['status' => 'Active']);

    return redirect()->route('admin.contracts.index')
        ->with('message', 'Contract confirmed successfully.');
}
public function updateStatus(Request $request, $id) {
    $contract = Contract::findOrFail($id);
    $contract->status = $request->status;
    $contract->save();

    return back()->with('success', 'Status updated successfully!');
}
}
