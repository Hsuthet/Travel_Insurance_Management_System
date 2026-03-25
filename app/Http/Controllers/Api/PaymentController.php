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
        // ✅ Validate payment data
        $request->validate([
            'contract_id'     => 'required|exists:contracts,contract_id',
            'payment_amount'  => 'required|numeric|min:0',
            'payment_method'  => 'required|string',
            'status'          => 'required|in:success,failed',
            'pay_date'        => 'required|date',
        ]);

        DB::beginTransaction();

        try {
            // Save Payment
            $payment = Payment::create([
                'contract_id'    => $request->contract_id,
                'payment_amount' => $request->payment_amount,
                'payment_method' => $request->payment_method,
                'status'         => $request->status,
                'pay_date'       => $request->pay_date,
            ]);

            if ($request->status === 'success') {
    $contract = Contract::findOrFail($request->contract_id);

    // Only generate if not already active to prevent duplicate increments
    if ($contract->status !== 'active') {
        
        // 1. Get the last assigned policy number (ordered numerically)
        $lastContract = Contract::whereNotNull('policy_no')
            ->orderBy('policy_no', 'desc')
            ->lockForUpdate() // 🔒 Prevents two payments from getting the same number at once
            ->first();

        $nextNumber = 1;

        if ($lastContract) {
            // Extract the digits: 'POL-000005' -> 5
            $lastNumber = (int) str_replace('POL-', '', $lastContract->policy_no);
            $nextNumber = $lastNumber + 1;
        }

        // 2. Format the new sequential number
        $contract->policy_no = 'POL-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

        // 3. Update status
        $contract->status = 'active';
        $contract->save();
    }
}

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Payment recorded successfully',
                'policy_no' => $contract->policy_no ?? null
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}