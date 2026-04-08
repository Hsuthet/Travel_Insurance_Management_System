<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment; 
use Inertia\Inertia;
use Carbon\Carbon;
use App\Services\GMOPaymentService; // Correct service path

class PaymentController extends Controller
{
    protected $gmoService;

    /**
     * 1. Constructor to Inject GMOService
     */
    public function __construct(GMOPaymentService $gmoService)
    {
        $this->gmoService = $gmoService;
    }

    /**
     * Display a listing of the resource (Inertia Table).
     */
    public function index(Request $request)
    {
        $query = Payment::query();

        // Filter Logic
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('startDate')) {
            $query->whereDate('pay_date', '>=', $request->startDate);
        }
        if ($request->filled('endDate')) {
            $query->whereDate('pay_date', '<=', $request->endDate);
        }

        $payments = $query->orderBy('pay_date', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($p) => [
                'id'             => $p->payment_id,
                'contract_id'    => 'CTR-' . str_pad($p->contract_id, 6, '0', STR_PAD_LEFT),
                'premium_amount' => number_format($p->payment_amount) . ' MMK',
                'status'         => $p->status === 'success' ? 'Accepted' : ucfirst($p->status),
                'pay_date'       => $p->pay_date ? Carbon::parse($p->pay_date)->format('d-m-Y') : '-',
            ]);

        return Inertia::render('Auth/Payment', [
            'payments' => $payments, // React component will receive this prop
            'filters'  => [
                'status'    => $request->status ?? '',
                'startDate' => $request->startDate ?? '',
                'endDate'   => $request->endDate ?? '',
            ],
        ]);
    }

    /**
     * Card အမျိုးအစားအလိုက် Token ထုတ်ပေးခြင်း (Testing အတွက် သီးသန့်သုံးရန်)
     */
    public function generateToken(Request $request)
    {
        $request->validate([
            'card_type' => 'required|string|in:visa,mastercard,amex',
        ]);

        try {
            // Service ထဲရှိ generateTokenForCard method ကို ခေါ်ယူခြင်း
            $response = $this->gmoService->generateTokenForCard($request->card_type);
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ငွေပေးချေမှု လုပ်ငန်းစဉ် ပင်မ Logic
     */
    public function process(Request $request)
    {
        // ၂။ Validation စစ်ဆေးခြင်း
        $request->validate([
            'amount'    => 'required|numeric|min:100',
            'order_id'  => 'required|string|max:40',
            'token'     => 'required|string',
            'card_type' => 'required|string|in:visa,mastercard,amex',
        ]);

        try {
            // ၃။ Order ID ကို Unique ဖြစ်အောင် သတ်မှတ်ခြင်း
            $orderId = substr(preg_replace('/[^a-zA-Z0-9]/', '', $request->order_id), 0, 30) . time();

            // ၄။ Step 1: Register transaction (EntryTran)
            $entryData = [
                'order_id' => $orderId,
                'amount'   => $request->amount,
            ];

            $entryResponse = $this->gmoService->entryTran($entryData);

            if (!$entryResponse['success']) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Entry failed', 
                    'error'   => $entryResponse['message'] ?? 'Unknown error'
                ], 400);
            }

            // ၅။ Step 2: Execute payment (ExecTran)
            $execData = [
                'access_id'   => $entryResponse['data']['AccessID'],
                'access_pass' => $entryResponse['data']['AccessPass'],
                'order_id'    => $orderId,
                'method'      => '1', // Lump sum payment
                'token'       => $request->token,
            ]; 

            // Testing လုပ်ဆောင်နေပါက Mock Card Data များ ထည့်သွင်းခြင်း
            if (config('app.env') !== 'production') {
                $testCards = $this->gmoService->getTestCards();
                $cardType  = $request->card_type ?? 'visa';
                $cardInfo  = $testCards[$cardType];

                $execData['card_number'] = $cardInfo['card_number'];
                $execData['expiry']      = $cardInfo['expiry'];
                $execData['cvv']         = $cardInfo['cvv'];
            }

            $execResponse = $this->gmoService->execTran($execData);

            // ၆။ ငွေဖြတ်ခြင်း အောင်မြင်/မအောင်မြင် စစ်ဆေးခြင်း
            if (!$execResponse['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment execution failed',
                    'error'   => $execResponse
                ], 400);
            }

            // ၇။ အောင်မြင်ပါက ပေးပို့မည့် Response
            return response()->json([
                'success'  => true,
                'message'  => 'Payment successful',
                'order_id' => $orderId,
                'data'     => $execResponse['data'] ?? []
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}