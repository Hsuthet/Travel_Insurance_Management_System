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

  protected static function booted()
{
    static::creating(function ($contract) {
        // DB Facade ကို သုံးပြီး အကြီးဆုံး contract_id ကို ရှာပါ
        $lastId = DB::table('contracts')->max('contract_id') ?? 0;
        
        $nextId = $lastId + 1;

        // ရှေ့မှာ သုည ၇ လုံးဖြည့်ပြီး TRV-0000001 ပုံစံထုတ်ယူခြင်း
        $contract->policy_no = 'TRV-' . str_pad($nextId, 7, '0', STR_PAD_LEFT);
    });
}


    // Relationships
    public function customer() { return $this->belongsTo(Customer::class, 'customer_id'); }
    public function plan() { return $this->belongsTo(Plan::class, 'plan_id'); }
    public function beneficiary() { return $this->belongsTo(Beneficiary::class, 'beneficiary_id'); }
    
    public function payments() { return $this->hasMany(Payment::class, 'contract_id'); }

}
