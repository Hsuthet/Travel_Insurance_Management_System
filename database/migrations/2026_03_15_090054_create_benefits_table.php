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
        Schema::create('benefits', function (Blueprint $table) {
            $table->id('benefit_id');
            $table->foreignId('plan_id')->constrained('plans', 'plan_id')->onDelete('cascade');
            $table->foreignId('benefittype_id')->constrained('benefit_types', 'benefittype_id')->onDelete('cascade');
            $table->integer('max_coverage');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('benefits');
    }
};
