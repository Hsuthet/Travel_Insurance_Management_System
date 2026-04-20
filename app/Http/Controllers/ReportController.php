<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Contract;
use Inertia\Inertia;
use Carbon\Carbon;

use Illuminate\Http\Request;

class ReportController extends Controller
{
   

public function index()
{
    
    $reports = Contract::with(['customer', 'plan', 'claims', 'payments', 'beneficiary'])       
        ->whereNotNull('policy_no')         
        ->whereIn('status', ['Active', 'Expire', 'Cancel'])
        ->latest()
        ->get()
        ->map(function ($contract) {
            $payment = $contract->payments->first(); 
            $customer = $contract->customer;
            $beneficiary = $contract->beneficiary;
           
            $latestClaim = $contract->claims()->latest('updated_at')->first();


            return [
               
                'id'            => $contract->contract_id,
                'policy_number' => $contract->policy_no,
                'customer_name' => $customer->name ?? '-',
                'plan_type'     => $contract->plan->plan_name ?? '-',
                'premium'       => number_format($contract->premium_amount) . ' MMK',
                'purchase_date' => $payment && $payment->pay_date 
                                    ? \Carbon\Carbon::parse($payment->pay_date)->format('d-m-Y') 
                                    : $contract->created_at->format('d-m-Y'),
                'status'        => $contract->status,

              'claim_status' => ($contract->status === 'active' && $latestClaim)
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
                'claim_amount'     => $claim->claim_amount ?? 0,
               
            ];
        });

    return Inertia::render('Admin/Reports', [
        'reports' => $reports
    ]);
}  


}

