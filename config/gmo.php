<?php

return [
    'sandbox'   => env('GMO_SANDBOX', true),
    'shop_id'   => env('GMO_SHOP_ID', ''),
    'shop_pass' => env('GMO_SHOP_PASS', ''),

    // ==== TOKEN GENERATION MODE ====
    // Set to true for real GMO API calls, false for mock tokens
    'use_real_tokens' => env('GMO_USE_REAL_TOKENS', false),

    'api_urls' => [
        'sandbox' => [ 
            'credit_card'  => 'https://pt01.mul-pay.jp/payment/EntryTran.idPass',
            'exec_credit'  => 'https://pt01.mul-pay.jp/payment/ExecTran.idPass',
            'alter_status' => 'https://pt01.mul-pay.jp/payment/AlterTran.idPass',
            'search_trade' => 'https://pt01.mul-pay.jp/payment/SearchTrade.idPass',
            'token'        => 'https://pt01.mul-pay.jp/payment/Token.idPass',
        ],
        'production' => [
            'credit_card'  => 'https://p01.mul-pay.jp/payment/EntryTran.idPass',
            'exec_credit'  => 'https://p01.mul-pay.jp/payment/ExecTran.idPass',
            'alter_status' => 'https://p01.mul-pay.jp/payment/AlterTran.idPass',
            'search_trade' => 'https://p01.mul-pay.jp/payment/SearchTrade.idPass',
            'token'        => 'https://p01.mul-pay.jp/payment/Token.idPass',
        ],
    ],

    'default_currency' => 'JPY',
];