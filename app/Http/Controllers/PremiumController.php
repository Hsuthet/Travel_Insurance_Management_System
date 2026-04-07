<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PremiumController extends Controller
{
   
    public function index()
    {
        
        $premiums = DB::table('contracts')
            ->leftJoin('payments', 'contracts.contract_id', '=', 'payments.contract_id')
            ->select(
                'contracts.contract_id',
                'contracts.premium_amount',
                'contracts.status as contract_status',
                'payments.status as payment_status',
                'payments.created_at as payment_date'
            )
            ->whereIn('contracts.status', ['wait_pay', 'active']) 
            ->orderBy('contracts.created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'contract_id'    => $item->contract_id,
                    'premium_amount' => number_format($item->premium_amount), 
                    'payment_date'   => $item->payment_date ? date('d-m-Y', strtotime($item->payment_date)) : '-',
                    
                  
                    'status'         => $item->contract_status === 'active' ? 'accepted' : 'pending',
                ];
            });

       
        return Inertia::render('Admin/InsurancePremium', [
            'premiums' => $premiums
        ]);
    }
}