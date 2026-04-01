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
    Schema::create('claims', function (Blueprint $table) {
        $table->id('claim_id');

        // 1. ADD THIS LINE - Create the column first
        $table->string('contract_id', 20); 

        // 2. NOW you can link it as a foreign key
        $table->foreign('contract_id')
              ->references('contract_id')
              ->on('contracts')
              ->onDelete('cascade');

        $table->dateTime('claim_date');
        $table->integer('claim_amount');
        $table->dateTime('accident_date');
        $table->text('accident_description');
        
        // These use foreignId because plan_id and benefit_id are still integers
        $table->foreignId('plan_id')->constrained('plans', 'plan_id')->onDelete('cascade');
        $table->foreignId('benefit_id')->constrained('benefits', 'benefit_id')->onDelete('cascade');
        
        $table->string('status', 50)->default('pending');
        $table->timestamps();
        $table->softDeletes();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
