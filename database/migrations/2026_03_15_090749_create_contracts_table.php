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
            $table->string('policy_no')->nullable()->unique();
            $table->foreignId('customer_id')->constrained('customers', 'customer_id');
            $table->unsignedBigInteger('beneficiary_id')->nullable();
            $table->foreign('beneficiary_id')
              ->references('beneficiary_id') 
              ->on('beneficiaries')          
              ->onDelete('set null');
            $table->foreignId('plan_id')->constrained('plans', 'plan_id');
            $table->string('trip_type', 50);
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('destination', 100)->nullable();
            $table->string('vehicle', 100)->nullable();
            $table->decimal('premium_amount', 12, 2);
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
