<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;

    protected $table = 'payments';
    protected $primaryKey = 'payment_id';
    protected $fillable = ['contract_id', 'payment_amount', 'payment_method', 'status', 'pay_date'];

    protected $casts = ['pay_date' => 'datetime'];

    public function contract() { return $this->belongsTo(Contract::class, 'contract_id'); }
}