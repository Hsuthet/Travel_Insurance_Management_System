<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $payment = Payment::create([
            'contract_id' => $request->contract_id,
            'payment_amount' => $request->payment_amount,
            'payment_method' => $request->payment_method,
            'status' => 'paid',
            'pay_date' => now()
        ]);

        return response()->json([
            'message' => 'Payment successful',
            'payment' => $payment
        ]);
    }
}