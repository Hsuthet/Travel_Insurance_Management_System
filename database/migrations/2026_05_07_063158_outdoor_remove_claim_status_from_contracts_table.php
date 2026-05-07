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
        $table->dropColumn('claim_status');
    });
}

public function down(): void
{
    Schema::table('contracts', function (Blueprint $table) {
        // Restore the column if rolled back
        $table->string('claim_status', 20)->nullable()->after('payment_token');
    });
}
};
