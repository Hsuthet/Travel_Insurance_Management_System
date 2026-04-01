<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Contract;
use App\Models\Payment;
use Carbon\Carbon;
use Inertia\Inertia; 

class DashboardController extends Controller
{
  public function index()
{
    // 1. Summary Counts
    $totalCustomers = Customer::count();
    $activeContracts = Contract::where('status', 'active')->count(); // Changed to match your variable name
    $totalClaims = \App\Models\Claim::count();

    // 2. Recent Lists
    $recentContracts = Contract::with(['customer'])
        ->latest()
        ->take(3)
        ->get();

   $recentClaims = \App\Models\Claim::with('contract.customer') // Go Claim -> Contract -> Customer
    ->latest()
    ->take(3)
    ->get();

    // 3. Plan Sales for the Bar Chart
    $planSales = Contract::selectRaw('plan_id, count(*) as total')
        ->groupBy('plan_id')
        ->get()
        ->map(function ($item) {
            $planNames = [1 => 'Basic', 2 => 'Standard', 3 => 'Premium'];
            return [
                'label' => $planNames[$item->plan_id] ?? 'Unknown',
                'value' => $item->total
            ];
        });

    // 4. Return to Inertia
    return Inertia::render('Admin/Dashboard', [
        'stats' => [
            'users'      => $totalCustomers,
            'contracts'  => $activeContracts, // FIXED: Changed from $activePolicies to $activeContracts
            'claims'     => $totalClaims,
            'chart_data' => $planSales,
            'max_sales'  => $planSales->max('value') ?: 10,
        ],
        'recentContracts' => $recentContracts,
        'recentClaims'    => $recentClaims,
        // FIXED: Removed the extra 'chartData' => $chartData line because it's already inside 'stats'
        'totalRevenue'    => (float) Payment::where('status', 'success')->sum('payment_amount'),
    ]);
}
}