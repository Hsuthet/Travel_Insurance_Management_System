<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Contract;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'contract_id'    => 'required|exists:contracts,contract_id',
        'payment_amount' => 'required|numeric|min:0',
        'payment_method' => 'required|string',
        'status'         => 'required|in:success,failed',
        'pay_date'       => 'required|date',
    ]);

    // 1. Find the contract first
    $contract = Contract::findOrFail($request->contract_id);

    // 2. Check if the status allows payment
    if ($contract->status !== 'wait_pay') {
        return response()->json([
            'status' => 'error',
            'message' => "Payment is not allowed. Current status: {$contract->status}"
        ], 400);
    }

    DB::beginTransaction();
    try {
        $payment = Payment::create([
            'contract_id'    => $request->contract_id,
            'payment_amount' => $request->payment_amount,
            'payment_method' => $request->payment_method,
            'status'         => $request->status,
            'pay_date'       => $request->pay_date,
        ]);

        if ($request->status === 'success') {
            // Generate Policy Number logic 
            $lastContract = Contract::whereNotNull('policy_no')
                ->orderBy('policy_no', 'desc')
                ->lockForUpdate()
                ->first();

            $nextNumber = 1;
            if ($lastContract) {
                $lastNumber = (int) str_replace('POL-', '', $lastContract->policy_no);
                $nextNumber = $lastNumber + 1;
            }

            $contract->policy_no = 'POL-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
            $contract->status = 'active'; // Change to Active
            $contract->save();
        }

        DB::commit();
        return response()->json([
            'status' => 'success',
            'message' => $request->status === 'success' ? 'Contract activated' : 'Payment failed recorded',
             'policy_no' => $contract->policy_no ?? null 
        ]);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}}