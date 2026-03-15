<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use SoftDeletes;

    protected $table = 'contracts'; 
    protected $primaryKey = 'contract_id';
    protected $fillable = ['policy_no', 'customer_id', 'beneficiary_id', 'plan_id', 'trip_type', 'start_date', 'end_date', 'destination', 'vehicle', 'premium_amount', 'status'];

    protected $casts = ['start_date' => 'datetime', 'end_date' => 'datetime'];

    // Relationships
    public function customer() { return $this->belongsTo(Customer::class, 'customer_id'); }
    public function plan() { return $this->belongsTo(Plan::class, 'plan_id'); }
    public function beneficiary() { return $this->belongsTo(Beneficiary::class, 'beneficiary_id'); }
    
    public function payments() { return $this->hasMany(Payment::class, 'contract_id'); }
}
