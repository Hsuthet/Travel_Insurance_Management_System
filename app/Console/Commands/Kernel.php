<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * သင်ဖန်တီးထားသော Command များကို Register လုပ်ရန်
     * (Laravel Version အနိမ့်ဆိုလျှင် ဤနေရာတွင် ထည့်ရပါမည်)
     */
    protected $commands = [
        Commands\ProcessGmoPayments::class,
    ];

    /**
     * Application ၏ Command Schedule များကို သတ်မှတ်ရန်
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // ၁။ 'contracts:process-payments' command ကို မိနစ်တိုင်း run မည်
        // ၂။ ထွက်လာသမျှ output (အောင်မြင်ခြင်း/ကျရှုံးခြင်း) ကို gmo_batch.log ထဲသို့ ပို့မည်
        $schedule->command('contracts:process-payments')
                 ->everyMinute()
                 ->appendOutputTo(storage_path('logs/gmo_batch.log'));

        /* မှတ်ချက် - အကယ်၍ bash script (run_gmo) ကို တိုက်ရိုက် run ချင်လျှင် အောက်ပါအတိုင်း သုံးနိုင်သည်
           $schedule->exec('sh ' . base_path('run_gmo'))->everyMinute();
        */
    }

    /**
     * Command များကို Register လုပ်ရန် လမ်းကြောင်းသတ်မှတ်ခြင်း
     *
     * @return void
     */
    protected function register()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}