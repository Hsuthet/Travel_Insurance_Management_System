<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PremiumController extends Controller
{
    public function index(Request $request) // Request $request ထည့်ပါ
    {
        // Filter values တွေကို ယူမယ်
        $status = $request->input('status');
        $startDate = $request->input('startDate');
        $endDate = $request->input('endDate');
        $perPage = $request->input('perPage', 5);

        $query = DB::table('contracts')
            ->leftJoin('payments', 'contracts.contract_id', '=', 'payments.contract_id')
            ->select(
                'contracts.contract_id',
                'contracts.premium_amount',
                'contracts.status as contract_status',
                'payments.status as payment_status',
                'payments.created_at as payment_date',
                'contracts.created_at as contract_created'
            )
            ->whereIn('contracts.status', ['wait_pay', 'active']);

        // --- Filtering Logic ---
        // 1. Status Filter
        if ($status && $status !== 'Status') {
            // Frontend က 'accepted' ပို့ရင် 'active' ကိုရှာ၊ 'pending' ပို့ရင် 'wait_pay' ကိုရှာ
            $dbStatus = ($status === 'accepted') ? 'active' : 'wait_pay';
            $query->where('contracts.status', $dbStatus);
        }

        // 2. Date Filter
        if ($startDate && $endDate) {
            $query->whereBetween('payments.created_at', [
                \Carbon\Carbon::parse($startDate)->startOfDay(),
                \Carbon\Carbon::parse($endDate)->endOfDay()
            ]);
        }

        // Pagination လုပ်မယ် (withQueryString() ပါမှ page လှန်ရင် filter တွေပါသွားမှာပါ)
        $premiumsPaginated = $query->orderBy('contracts.created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Data format ပြင်မယ်
        $premiums = $premiumsPaginated->through(function ($item) {
            return [
                'contract_id'    => $item->contract_id,
                'premium_amount' => number_format($item->premium_amount) . ' MMK', 
                'payment_date'   => $item->payment_date ? date('d-m-Y', strtotime($item->payment_date)) : '-',
                'status'         => $item->contract_status === 'active' ? 'accepted' : 'pending',
            ];
        });

        return Inertia::render('Admin/InsurancePremium', [
            'premiums' => $premiums,
            'filters'  => $request->only(['status', 'startDate', 'endDate', 'perPage'])
        ]);
    }
}