<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Claim extends Model
{
    use SoftDeletes;

    protected $table = 'claims';
    protected $primaryKey = 'claim_id';
    protected $fillable = ['contract_id', 'claim_date', 'claim_amount', 'accident_date', 'accident_description', 'plan_id', 'benefit_id', 'status'];

    protected $casts = ['claim_date' => 'datetime', 'accident_date' => 'datetime'];

    public function contract() { return $this->belongsTo(Contract::class, 'contract_id'); }
}

