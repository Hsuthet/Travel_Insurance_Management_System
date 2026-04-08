<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\GMOPaymentService; // ၁။ Service Name မှန်ကန်ရပါမည်

class GmoPaymentController extends Controller
{
    protected $gmoService;

    // ၂။ Constructor - GMOPaymentService ကို Inject လုပ်ခြင်း
    public function __construct(GMOPaymentService $gmoService)
    {
        $this->gmoService = $gmoService;
    } // ဒီနေရာမှာ Class ကို ပိတ်မချရပါ

    /**
     * 'wait pay' ဖြစ်နေသော စာချုပ်များကို Loop ပတ်ပြီး ငွေဖြတ်မည်
     */
    public function processContractPayments(Request $request)
    {
        // ၁။ Validation (Card Token ပါရမည်)
        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            // ၂။ Status က 'wait pay' ဖြစ်နေသော Contract များကို ဆွဲထုတ်ခြင်း
            $contracts = DB::table('contracts')
                ->where('status', 'wait-pay')
                ->get();

            if ($contracts->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'ပေးချေရန် Wait Pay စာချုပ် မရှိပါ။'
                ], 404);
            }

            $results = [];

            // ၃။ Loop ပတ်ပြီး တစ်ခုချင်းစီ ငွေဖြတ်ခြင်း
            foreach ($contracts as $contract) {
                
                $processResult = DB::transaction(function () use ($contract, $request) {
                    
                    // Double Charge မဖြစ်အောင် Lock လုပ်ခြင်း
                    $currentContract = DB::table('contracts')
                        ->where('id', $contract->id)
                        ->where('status', 'wait-pay')
                        ->lockForUpdate()
                        ->first();

                    if (!$currentContract) return null;

                    // ၄။ Unique Order ID သတ်မှတ်ခြင်း
                    $orderId = 'POL-' . $currentContract->id . '-' . time();

                    // ၅။ GMO Entry Transaction
                    $entry = $this->gmoService->entryTran([
                        'order_id' => $orderId,
                        'amount'   => $currentContract->premium_amount
                    ]);

                    if (!$entry['success']) {
                        Log::error("GMO Entry Error for Contract {$currentContract->id}: " . json_encode($entry));
                        return ['id' => $currentContract->id, 'status' => 'failed', 'error' => 'Entry Error'];
                    }

                    // ၆။ GMO Execute Transaction
                    $exec = $this->gmoService->execTran([
                        'access_id'   => $entry['data']['AccessID'], 
                        'access_pass' => $entry['data']['AccessPass'], 
                        'order_id'    => $orderId, 
                        'token'       => $request->token
                    ]);

                    if (!$exec['success']) {
                        Log::error("GMO Exec Error for Contract {$currentContract->id}: " . json_encode($exec));
                        return ['id' => $currentContract->id, 'status' => 'failed', 'error' => 'Card Error'];
                    }

                    // ၇။ အောင်မြင်ပါက Database များ Update လုပ်ခြင်း
                    // (က) Contract status ကို active ပြောင်းခြင်း
                    DB::table('contracts')->where('id', $currentContract->id)->update([
                        'status' => 'active',
                        'updated_at' => now()
                    ]);

                    // (ခ) Payment table ထဲတွင် မှတ်တမ်းအသစ်သွင်းခြင်း
                    DB::table('payments')->insert([
                        'contract_id' => $currentContract->id,
                        'order_id'    => $orderId,
                        'amount'      => $currentContract->premium_amount,
                        'status'      => 'success',
                        'pay_date'    => now(),
                        'created_at'  => now(),
                        'updated_at'  => now(),
                    ]);

                    return ['id' => $currentContract->id, 'status' => 'success', 'order_id' => $orderId];
                });

                if ($processResult) {
                    $results[] = $processResult;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Processing completed.',
                'data' => $results
            ]);

        } catch (\Exception $e) {
            Log::error("Loop Payment Exception: " . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
} // Class အပိတ်က ဒီနေရာမှာပဲ ရှိရပါမယ်