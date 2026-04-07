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
    Schema::create('payments', function (Blueprint $table) {
        $table->id('payment_id');
        $table->string('contract_id', 20);
        $table->string('gmo_access_id')->nullable(); 

        $table->foreign('contract_id')
              ->references('contract_id')
              ->on('contracts')
              ->onDelete('cascade');

        $table->integer('payment_amount')->default(0);
        $table->string('payment_method', 100);
        $table->string('status', 100)->default('pending');
        $table->dateTime('pay_date')->useCurrent();
        $table->timestamps();
        $table->softDeletes();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
