<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CloseExpiredContracts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:close-expired-contracts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
   public function handle()
{
    $this->info('Checking for expired contracts...');

    $affectedRows = \App\Models\Contract::whereIn('status', ['approved', 'active', 'wait_pay'])
        ->whereDate('end_date', '<', now())
        ->update(['status' => 'expired']);

    if ($affectedRows > 0) {
        // Use info() instead of success()
        $this->info("Process complete! {$affectedRows} contracts were moved to 'expired'.");
    } else {
        $this->comment('No expired contracts found today.');
    }

    return 0;
}
}
