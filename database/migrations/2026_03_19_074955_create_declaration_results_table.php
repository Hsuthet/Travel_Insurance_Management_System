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
      Schema::create('declaration_results', function (Blueprint $table) {
        $table->id('result_id'); // Primary Key
        
        // Foreign Key to Customers
        $table->foreignId('customer_id')->constrained('customers', 'customer_id')->onDelete('cascade');
        
        // Foreign Key to Declarations (Master Data)
        $table->foreignId('declaration_id')->constrained('declarations', 'declaration_id');
        
        // The actual answer (true/false)
        $table->boolean('check_result')->default(false);
        
        $table->timestamps(); 
        $table->softDeletes(); 
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('declaration_results');
    }
};
