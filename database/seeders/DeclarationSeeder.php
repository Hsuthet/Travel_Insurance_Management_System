<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Declaration;

class DeclarationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        // Define the plans and their specific 4 declarations
        $plans = [
            1 => [ // Basic Plan
                'I declare that I am currently in good health and physically fit for travel.',
                'I confirm I do not have pre-existing conditions requiring hospital treatment.',
                'I understand the Basic Plan does not cover pregnancy-related care.',
                'I certify all medical information provided is true and accurate.'
            ],
            2 => [ // Standard Plan
                'I declare I am not traveling against the advice of a medical professional.',
                'I understand that cancellation coverage applies only to unforeseen events.',
                'I confirm I have not been advised by any authority to cancel my travel.',
                'I acknowledge this policy does not cover changes in personal plans.'
            ],
            3 => [ // Premium Plan
                'I declare I do not engage in high-risk professional sports or hazardous activities.',
                'I understand the accidental death benefit will be paid to my legal beneficiaries.',
                'I confirm that the information regarding my age and occupation is accurate.',
                'I certify that any false representation may render this insurance policy void.'
            ],
        ];

        foreach ($plans as $planId => $descriptions) {
            foreach ($descriptions as $text) {
                Declaration::create([
                    'plan_id'     => $planId,
                    'description' => $text,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }
        }
    }
    
}
