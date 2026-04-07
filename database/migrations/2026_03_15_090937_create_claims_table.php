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
        // 1. The actual Primary Key for this table
        $table->id('claim_id');

        // 2. Define policy_no as a string to match the 'contracts' table
        // We use string because policy numbers usually contain letters/numbers
        $table->string('policy_no', 20);

        // 3. Set up the Foreign Key relationship
        $table->foreign('policy_no')
              ->references('policy_no')
              ->on('contracts')
              ->onDelete('cascade');

        $table->dateTime('claim_date');
        $table->integer('claim_amount');
        $table->dateTime('accident_date');
        $table->text('accident_description');
        
        // 4. Plan and Benefit relationships
        $table->foreignId('plan_id')->constrained('plans', 'plan_id')->onDelete('cascade');
        $table->foreignId('benefit_id')->constrained('benefits', 'benefit_id')->onDelete('cascade');
        
        $table->string('status', 50)->default('pending');
        $table->text('reject_reason')->nullable();
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
