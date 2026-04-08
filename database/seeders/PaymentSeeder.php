<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\Contract;
use App\Models\Customer;
use Carbon\Carbon;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ၁။ Contract တစ်ခုမှ မရှိသေးရင် Test အတွက် တစ်ခု အရင်ဆောက်ပါမယ်
        $contract = Contract::first();

        if (!$contract) {
            $customer = Customer::first() ?? Customer::create([
                'name' => 'Aye Thu Test',
                'email' => 'ayethu@example.com',
                'phone' => '0912345678',
                'dob' => '1995-01-01'
            ]);

            $contract = Contract::create([
                'customer_id'    => $customer->customer_id,
                'plan_id'        => 1, 
                'trip_type'      => 'single',
                'start_date'     => now(),
                'end_date'       => now()->addDays(7),
                'destination'    => 'Japan',
                'premium_amount' => 5000,
                'status'         => 'active',
            ]);
        }

        // ၂။ သင့်ရဲ့ Migration Table အတိုင်း Column နာမည်များ အတိအကျ ထည့်သွင်းခြင်း
        Payment::create([
            'contract_id'    => $contract->contract_id,
            'payment_amount' => $contract->premium_amount, // Migration: payment_amount
            'payment_method' => 'Credit Card',             // Migration: payment_method
            'status'         => 'success',                 // Migration: status
            'pay_date'       => Carbon::now(),             // Migration: pay_date
        ]);
    }
}