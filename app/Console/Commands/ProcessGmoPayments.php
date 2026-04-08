<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Services\GMOPaymentService;
use Illuminate\Support\Facades\Schema;

class ProcessGmoPayments extends Command
{
    protected $signature = 'contracts:process-payments {token?}';
    protected $description = 'Process all wait-pay contracts via GMO Payment Gateway';

    public function handle(GMOPaymentService $gmoService)
    {
        $this->info("--- Starting GMO Batch Process ---");

        // 1. Get Token
        $token = $this->argument('token');
        if (!$token) {
            $tokenResponse = $gmoService->generateTokenForCard('visa');
            $token = $tokenResponse['token'] ?? null;
        }

        if (!$token) {
            $this->error("Could not generate or find a valid Token.");
            return;
        }

        // 2. Fetch contracts
        // Note: Make sure 'wait-pay' matches exactly what is in your DB
        $contracts = DB::table('contracts')
            ->where('status', 'wait-pay')
            ->whereNull('deleted_at')
            ->get();

        if ($contracts->isEmpty()) {
            $this->warn("No 'wait-pay' contracts found in the database.");
            return;
        }

        // Determine the ID column name dynamically to prevent "Undefined property" errors
        $idColumn = Schema::hasColumn('contracts', 'id') ? 'id' : 'contract_id';

        foreach ($contracts as $contract) {
            // Use the dynamic ID column
            $currentId = $contract->$idColumn;
            
            $this->info("------------------------------------------");
            $this->info("Processing Contract: {$currentId}");

            try {
                // 3. Execute Payment via Service
                $paymentResponse = $gmoService->executeRealPayment($contract, $token);

                if ($paymentResponse['success']) {
                    DB::transaction(function () use ($contract, $idColumn, $currentId) {
                        // Update Contract Status
                        DB::table('contracts')
                            ->where($idColumn, $currentId)
                            ->update([
                                'status' => 'active',
                                'updated_at' => now()
                            ]);

                        // Insert Payment Record
                        DB::table('payments')->insert([
                            'contract_id' => $currentId,
                            'amount'      => $contract->premium_amount ?? 0,
                            'status'      => 'success',
                            'pay_date'    => now(),
                            'created_at'  => now(),
                            'updated_at'  => now(),
                        ]);
                    });

                    $this->info("✅ Successfully paid for ID: {$currentId}");
                } else {
                    $this->error("❌ Payment Failed for ID: {$currentId}");
                    $this->error("Reason: " . ($paymentResponse['message'] ?? 'Unknown Error'));
                }

            } catch (\Exception $e) {
                $this->error("Error on ID {$currentId}: " . $e->getMessage());
            }
        }

        $this->info("------------------------------------------");
        $this->info("--- Process Finished ---");
    }
}