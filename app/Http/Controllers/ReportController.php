<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Contract;
use Inertia\Inertia;
use Carbon\Carbon;

use Illuminate\Http\Request;

class ReportController extends Controller
{
   

public function index(Request $request)
{
    // Filter parameters တွေကို ယူမယ်
    $perPage = $request->input('perPage', 5);
    $status = $request->input('status');
    $claimStatus = $request->input('claimStatus');
    $startDate = $request->input('startDate');
    $endDate = $request->input('endDate');

    $query = Contract::with(['customer', 'plan', 'claims', 'payments', 'beneficiary'])      
        ->whereNotNull('policy_no');

    // --- Filtering Logic (Database level မှာ စစ်ထုတ်မယ်) ---
    if ($status && $status !== 'Status') {
        $query->where('status', strtolower($status));
    } else {
        $query->whereIn('status', ['active', 'expired', 'canceled']);
    }

    if ($startDate && $endDate) {
        $query->whereBetween('created_at', [
            \Carbon\Carbon::parse($startDate)->startOfDay(),
            \Carbon\Carbon::parse($endDate)->endOfDay()
        ]);
    }

    $reportsPaginated = $query->latest()->paginate($perPage)->withQueryString();

    $reports = $reportsPaginated->through(function ($contract) {
        $payment = $contract->payments->first(); 
        $customer = $contract->customer;
        $beneficiary = $contract->beneficiary;
        $dbStatus = strtolower($contract->status);
        $latestClaim = $contract->claims->sortByDesc('updated_at')->first();

        return [
            'id'            => $contract->contract_id,
            'policy_number' => $contract->policy_no,
            'customer_name' => $customer->name ?? '-',
            'plan_type'     => $contract->plan->plan_name ?? '-',
            'premium'       => number_format($contract->premium_amount) . ' MMK',
            'purchase_date' => $payment && $payment->pay_date 
                                ? \Carbon\Carbon::parse($payment->pay_date)->format('d-m-Y') 
                                : $contract->created_at->format('d-m-Y'),
            'status'        => $dbStatus,
            'claim_status'  => ($latestClaim)
                                ? match (strtolower($latestClaim->claim_status)) { 
                                    'accepted' => 'Claimed',
                                    'pending'  => 'Pending',
                                    'rejected' => 'Rejected',
                                    default    => 'No Claim',
                                }
                                : 'No Claim',
            'customer_nrc'     => $customer->nrc ?? '-',
            'customer_phone'   => $customer->phone ?? '-',
            'customer_email'   => $customer->email ?? '-',
            'customer_address' => $customer->address ?? '-',
            'customer_dob'     => $customer->dob ?? '-',
            'trip_type'        => $contract->trip_type ?? '-',
            'destination'      => $contract->destination ?? '-',
            'vehicle'          => $contract->vehicle ?? '-',
            'start_date'       => $contract->start_date ?? '-',
            'end_date'         => $contract->end_date ?? '-',
            'beneficiary_name' => $beneficiary->name ?? '-',
            'beneficiary_rel'  => $beneficiary->relationship ?? '-',
            'claim_amount'     => $contract->claims->sum('claim_amount') ?? 0,
        ];
    });

    return Inertia::render('Admin/Reports', [
        'reports' => $reports,
        'filters' => $request->only(['perPage', 'status', 'claimStatus', 'startDate', 'endDate']),
    ]);
}

}

