<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Contract extends Model
{
    use SoftDeletes;

    protected $table = 'contracts'; 
    protected $primaryKey = 'contract_id';
    protected $fillable = ['policy_no', 'customer_id', 'beneficiary_id', 'plan_id', 'trip_type', 'start_date', 'end_date', 'destination', 'vehicle', 'premium_amount', 'status','nrc','passport','ticket_image'];

    protected $casts = ['start_date' => 'datetime', 'end_date' => 'datetime'];

// In Contract.php Model
public function getIsExpiredAttribute() {
    return now()->gt($this->end_date);
}
    // Relationships
    public function customer()
{
    // belongsTo(RelatedModel, foreign_key_on_this_table, owner_key_on_target_table)
    return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
}
    public function plan() { return $this->belongsTo(Plan::class, 'plan_id'); }
    public function beneficiary() { return $this->belongsTo(Beneficiary::class, 'beneficiary_id'); }
    
    public function payments() { return $this->hasMany(Payment::class, 'contract_id'); }

}
