<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Contract extends Model
{
    use SoftDeletes;

    protected $table = 'contracts'; 
    protected $primaryKey = 'contract_id';
    
    // --- CRITICAL FIXES FOR CUSTOM IDs ---
    public $incrementing = false; 
    protected $keyType = 'string'; 

    protected $fillable = [
        'contract_id', // Add this if you manually generate the ID
        'policy_no', 
        'customer_id', 
        'beneficiary_id', 
        'plan_id', 
        'trip_type', 
        'start_date', 
        'end_date', 
        'destination', 
        'vehicle', 
        'premium_amount', 
        'status',
        'nrc',
        'passport',
        'ticket_image',
        'payment_token'
    ];

    protected $casts = [
        'start_date' => 'datetime', 
        'end_date' => 'datetime',
        'premium_amount' => 'decimal:2' // Good for financial accuracy
    ];

    // Accessor for expiration status
    public function getIsExpiredAttribute() {
        return now()->gt($this->end_date);
    }

    // --- RELATIONSHIPS ---

    public function customer()
    {
        // Explicitly defining keys is safer for custom ID setups
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function plan() 
    { 
        return $this->belongsTo(Plan::class, 'plan_id', 'plan_id'); 
    }

    public function beneficiary() 
    { 
        return $this->belongsTo(Beneficiary::class, 'beneficiary_id', 'beneficiary_id'); 
    }
    
    public function payments() { return $this->hasMany(Payment::class, 'contract_id'); }

    public function claims(){ return $this->hasMany(Claim::class, 'contract_id', 'contract_id');}

}
