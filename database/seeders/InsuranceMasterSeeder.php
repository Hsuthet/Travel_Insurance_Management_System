<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BenefitType;
use App\Models\Plan;
use App\Models\Benefit;

class InsuranceMasterSeeder extends Seeder
{
    public function run()
    {
        
        $hospital = BenefitType::create([
            'benefittype_name' => 'Hospitalization',
            'description' => 'Coverage for hospital room and board'
        ]);

        $cancellation = BenefitType::create([
            'benefittype_name' => 'Trip Cancellation',
            'description' => 'Refund for cancelled trips'
        ]);

        $death = BenefitType::create([
            'benefittype_name' => 'Accidental Death',
            'description' => 'Accidental Death coverage'
        ]);

        //Basic plan (Hospital)
        $basic = Plan::create([
            'plan_name' => 'Basic',
            'daily_rate' => 2500,
            'description' => 'Essential coverage'
        ]);
        Benefit::create([
            'plan_id' => $basic->plan_id,
            'benefittype_id' => $hospital->benefittype_id,
            'max_coverage' => 25000
        ]);

        //  Standard Plan (Hospital + Trip Cancellation)
        $standard = Plan::create([
            'plan_name' => 'Standard',
            'daily_rate' => 4500,
            'description' => 'Recommended for travelers;Popular Plan'
        ]);
        Benefit::create(['plan_id' => $standard->plan_id, 'benefittype_id' => $hospital->benefittype_id, 'max_coverage' => 25000]);
        Benefit::create(['plan_id' => $standard->plan_id, 'benefittype_id' => $cancellation->benefittype_id, 'max_coverage' => 20000]);

        // ၄။ Premium Plan (Hospital + Trip Cancellation + Death)
        $premium = Plan::create([
            'plan_name' => 'Premium',
            'daily_rate' => 6000,
            'description' => 'Complete peace of mind'
        ]);
        Benefit::create(['plan_id' => $premium->plan_id, 'benefittype_id' => $hospital->benefittype_id, 'max_coverage' => 250000]);
        Benefit::create(['plan_id' => $premium->plan_id, 'benefittype_id' => $cancellation->benefittype_id, 'max_coverage' => 20000]);
        Benefit::create(['plan_id' => $premium->plan_id, 'benefittype_id' => $death->benefittype_id, 'max_coverage' => 1000000]);
    }
}