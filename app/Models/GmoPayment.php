<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GmoPayment extends Model
{
    // Table ထဲကို data သွင်းခွင့်ပြုမယ့် column များ
    protected $fillable = [
        'payment_id', 
        'order_id', 
        'access_id', 
        'access_pass', 
        'error_code'
    ];

    // ရှိပြီးသား payments table နဲ့ ချိတ်ဆက်မှု
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}