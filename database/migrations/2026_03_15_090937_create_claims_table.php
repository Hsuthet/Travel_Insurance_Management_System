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
           $table->string('policy_no');
           $table->foreign('policy_no')
                 ->references('policy_no')
                 ->on('contracts')
                 ->onDelete('cascade');
           $table->dateTime('claim_date');
           $table->integer('claim_amount');
           $table->dateTime('accident_date');
           $table->text('accident_description');
           $table->foreignId('plan_id')->constrained('plans', 'plan_id')->onDelete('cascade');
           $table->foreignId('benefit_id')->constrained('benefits', 'benefit_id')->onDelete('cascade');
           $table->string('status', 50)->default('pending');
           $table->text('reject_resason')->nullable();
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