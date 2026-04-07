<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessGmoPayment extends Command
{
    protected $signature = 'payment:process-gmo';

    public function handle()
    {
        $this->info("--- GMO API Payment Processing Started ---");

       
        $contracts = DB::table('contracts')
            ->where('status', 'wait_pay')
            ->whereNotNull('payment_token') 
            ->get();

        if ($contracts->isEmpty()) {
            $this->warn("No pending payments found with status 'wait_pay'.");
            return;
        }

        foreach ($contracts as $contract) {
            $gmoOrderId = substr($contract->contract_id . time(), 0, 27);
            $this->info("Processing Contract ID: {$contract->contract_id} with OrderID: {$gmoOrderId}");

            try {
                $amount = (int) $contract->premium_amount;
                $apiUrl = rtrim(config('services.gmo.api_base_url'), '/') . '/';

              
              
                $finalAccessId = 'TEST_MODE_' . uniqid(); 

                
                DB::transaction(function () use ($contract, $finalAccessId) {
                    
                    
                    $idParts = explode('-', $contract->contract_id);
                    $numericPart = end($idParts); 
                    
                    $policyNo = 'POL-' . str_pad($numericPart, 5, '0', STR_PAD_LEFT);

                    DB::table('payments')->insert([
                        'contract_id'    => $contract->contract_id,
                        'gmo_access_id'  => $finalAccessId,
                        'payment_amount' => $contract->premium_amount,
                        'status'         => 'success',
                        'created_at'     => now(),
                    ]);

                    DB::table('contracts')->where('contract_id', $contract->contract_id)->update([
                        'status'     => 'active',
                        'policy_no'  => $policyNo, 
                        'updated_at' => now()
                    ]);
                
                });

                $this->info("SUCCESS: Contract {$contract->contract_id} is now ACTIVE.");

            } catch (\Exception $e) {
                $this->error("System Error: " . $e->getMessage());
                Log::error("GMO Process Failed: " . $e->getMessage());
            }
        }

        $this->info("--- Processing Finished ---");
    }
}