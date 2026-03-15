<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id('contract_id');
            $table->string('policy_no', 50);
            $table->foreignId('customer_id')->constrained('customers', 'customer_id');
            $table->foreignId('beneficiary_id')->constrained('beneficiaries', 'beneficiary_id');
            $table->foreignId('plan_id')->constrained('plans', 'plan_id');
            $table->string('trip_type', 50);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('destination', 100)->nullable();
            $table->string('vehicle', 100)->nullable();
            $table->integer('premium_amount');
            $table->string('status', 20);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
