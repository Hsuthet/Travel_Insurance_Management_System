<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Contract;

class GMOPaymentService
{
    protected $shopId;
    protected $shopPass;
    protected $useRealTokens;
    protected $apiUrls;

    public function __construct()
    {
        $this->shopId = env('GMO_SHOP_ID');
        $this->shopPass = env('GMO_SHOP_PASS');
        $this->useRealTokens = env('GMO_USE_REAL_TOKENS', false);

        $isSandbox = env('GMO_SANDBOX', true);
        $baseUrl = $isSandbox ? 'https://pt01.mul-pay.jp/payment/' : 'https://p01.mul-pay.jp/payment/';

        $this->apiUrls = [
            'token'  => $baseUrl . 'Token.idPass',
            'entry'  => $baseUrl . 'EntryTran.idPass',
            'exec'   => $baseUrl . 'ExecTran.idPass',
        ];
    }

    /**
     * Test Card Data for Controller/Testing
     */
   public function getTestCards()
{
    return [
        'visa' => [
            'card_number' => '4111111111111111',
            'expiry'      => '2812', // ၂၀၂၈ ခုနှစ်၊ ၁၂ လပိုင်း (YYMM format)
            'cvv'         => '123'
        ],
        'mastercard' => [
            'card_number' => '5411111111111111',
            'expiry'      => '2812',
            'cvv'         => '123'
        ]
    ];
}

    /**
     * Entry + Exec Transaction Logic
     * This handles the dynamic ID to prevent "Undefined property" errors.
     */
    public function executeRealPayment($contract, $token)
    {
        try {
            // Check if primary key is 'id' or 'contract_id'
            $cId = $contract->id ?? $contract->contract_id ?? '0';
            
            // Generate a unique OrderID
            $orderId = 'POL-' . $cId . '-' . time();

            // 1. Entry Transaction
            $entry = $this->entryTran([
                'order_id' => $orderId,
                'amount'   => $contract->premium_amount ?? 0,
            ]);

            if (!$entry['success']) {
                return ['success' => false, 'message' => 'GMO Entry Error: ' . ($entry['error'] ?? 'Unknown')];
            }

            // 2. Execute Transaction
            return $this->execTran([
                'access_id'   => $entry['data']['AccessID'],
                'access_pass' => $entry['data']['AccessPass'],
                'order_id'    => $orderId,
                'token'       => $token,
            ]);

        } catch (\Exception $e) {
            Log::error("GMO Service Exception: " . $e->getMessage());
            return ['success' => false, 'message' => "Service Error: " . $e->getMessage()];
        }
    }

    /**
     * API Call Wrapper
     */
    public function entryTran(array $data)
    {
        return $this->makeRequest($this->apiUrls['entry'], [
            'ShopID'   => $this->shopId,
            'ShopPass' => $this->shopPass,
            'OrderID'  => $data['order_id'],
            'JobCd'    => 'CAPTURE',
            'Amount'   => $data['amount'],
        ]);
    }

    public function execTran(array $data)
    {
        return $this->makeRequest($this->apiUrls['exec'], [
            'AccessID'   => $data['access_id'],
            'AccessPass' => $data['access_pass'],
            'OrderID'    => $data['order_id'],
            'Method'     => '1',
            'Token'      => $data['token'],
        ]);
    }

    /**
     * Core Request Handler
     */
    private function makeRequest($url, $params)
    {
        try {
            $response = Http::asForm()->post($url, $params);
            
            if ($response->successful()) {
                parse_str($response->body(), $result);
                
                if (isset($result['ErrCode'])) {
                    Log::error("GMO API Error: " . $result['ErrCode']);
                    return ['success' => false, 'error' => $result['ErrCode']];
                }

                return ['success' => true, 'data' => $result];
            }
            return ['success' => false, 'error' => 'HTTP Connection Failed'];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Token Generation
     */
    public function generateTokenForCard($cardType)
    {
        if (!$this->useRealTokens) {
            return ['success' => true, 'token' => 'mock_' . bin2hex(random_bytes(8))];
        }

        $card = $this->getTestCards()[$cardType] ?? $this->getTestCards()['visa'];
        
        return $this->makeRequest($this->apiUrls['token'], [
            'ShopID'       => $this->shopId,
            'ShopPass'     => $this->shopPass,
            'CardNo'       => $card['card_number'],
            'Expire'       => $card['expiry'],
            'SecurityCode' => $card['cvv'],
            'TokenNumber'  => 1
        ]);
    }
}