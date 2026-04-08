<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

   'gmo' => [
    'shop_id'    => env('GMO_SHOP_ID'),
    'shop_pass'  => env('GMO_SHOP_PASS'),
    'is_sandbox' => env('GMO_SANDBOX', true),
    'base_url'   => env('GMO_SANDBOX', true) 
                        ? 'https://pt01.mul-pay.jp/payment/' 
                        : 'https://p01.mul-pay.jp/payment/',
],
];
