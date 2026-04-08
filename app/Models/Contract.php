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

    // Fillable ကို တစ်ခုတည်းမှာ အကုန်စုရေးပါ
    protected $fillable = [
        'policy_no', 
        'customer_id',      // database မှာ person_id ဆိုရင် ဒါကို person_id ပြောင်းပါ
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
        'ticket_image'
    ];

    protected $casts = [
        'start_date' => 'datetime', 
        'end_date' => 'datetime'
    ];

    // Policy Number ကို အလိုအလျောက် ထုတ်ပေးရန် (TRV-0000001)
    protected static function booted()
    {
        static::creating(function ($contract) {
            // လက်ရှိ ရှိပြီးသား အကြီးဆုံး ID ကို ယူသည်
            $lastId = DB::table('contracts')->max('contract_id') ?? 0;
            $nextId = $lastId + 1;

            // policy_no ကို format လုပ်ပြီး ထည့်သွင်းသည်
            $contract->policy_no = 'TRV-' . str_pad($nextId, 7, '0', STR_PAD_LEFT);
        });
    }

    // Relationships
    // foreign key နေရာမှာ 'customer_id' လား 'person_id' လား သေချာစစ်ဆေးပါ
    public function customer() { 
        return $this->belongsTo(Customer::class, 'customer_id'); 
    }
    
    public function plan() { 
        return $this->belongsTo(Plan::class, 'plan_id'); 
    }
    
    public function beneficiary() { 
        return $this->belongsTo(Beneficiary::class, 'beneficiary_id'); 
    }
    
    public function payments() { 
        return $this->hasMany(Payment::class, 'contract_id'); 
    }

    
}