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
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id('beneficiary_id');
            $table->string('name', 100);
            $table->string('phone', 100);
            $table->string('nrc', 100);
            $table->string('passport', 100);
            $table->string('relationship', 50);
            $table->foreignId('customer_id')
                  ->constrained('customers', 'customer_id')
                  ->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beneficiaries');
    }
};
