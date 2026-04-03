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
        Schema::table('contracts', function (Blueprint $table) {
            // 1. Store the GMO Payment Token
            $table->text('payment_token')->nullable()->after('status');
            
            // 2. Change boolean to string to support: pending, claimed, rejected
            // We set it to nullable because a brand new contract has NO claim status yet.
            $table->string('claim_status', 20)->nullable()->after('payment_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            // Drop both columns if we roll back
            $table->dropColumn(['payment_token', 'claim_status']);
        });
    }
};