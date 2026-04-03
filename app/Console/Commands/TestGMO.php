<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
class TestGMO extends Command
{
   /**
    * The name and signature of the console command.
    * terminal မှာ run ရမယ့် command အမည်
    */
   protected $signature = 'app:test-gmo';
   /**
    * The console command description.
    */
   protected $description = 'GMO Payment Gateway API Connection Test';
   /**
    * Execute the console command.
    */
   public function handle()
   {
       $this->info('Connecting to GMO Payment Gateway...');
       // .env ထဲက data တွေကို ယူသုံးပါမယ် (မထည့်ရသေးရင် အောက်က code မှာ တိုက်ရိုက်ထည့်စမ်းနိုင်ပါတယ်)
       $shopId = env('GMO_SHOP_ID', 'tshop00076356');
       $shopPass = env('GMO_SHOP_PASS'); // သင်၏ Shop Password ကို .env ထဲတွင် အရင်ထည့်ပါ
       $apiUrl = "https://pt01.mul-pay.jp/payment/EntryTran.idPass";
       try {
           // GMO API သို့ POST Request ပို့ခြင်း
           $response = Http::asForm()->post($apiUrl, [
               'ShopID'   => $shopId,
               'ShopPass' => $shopPass,
               'OrderID'  => 'TEST_ORDER_' . time(), // ထပ်မသွားအောင် time() ထည့်ထားပါတယ်
               'Amount'   => 1000,                  // စမ်းသပ်ရန် ပမာဏ
               'JobCd'    => 'AUTH',                // စစ်ဆေးရန် (Authorization)
           ]);
           if ($response->successful()) {
               $this->warn("--- GMO Raw Response ---");
               $this->line($response->body());
               $this->warn("------------------------");
               // Response ထဲမှာ AccessID ပါလာရင် ချိတ်ဆက်မှု အောင်မြင်ပါပြီ
               if (str_contains($response->body(), 'AccessID')) {
                   $this->info('✅ Connection Success! GMO API is reachable.');
               } else {
                   $this->error('❌ Connection Made, but GMO returned an error.');
                   $this->line('Hint: Check if your ShopPass is correct in .env');
               }
           } else {
               $this->error('❌ HTTP Request Failed!');
               $this->line('Status Code: ' . $response->status());
           }
       } catch (\Exception $e) {
           $this->error('❌ Exception Error: ' . $e->getMessage());
       }
   }
}