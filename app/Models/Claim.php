<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Claim extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'claims';

    protected $primaryKey = 'claim_id';

    protected $fillable = [
        'policy_no',
        'claim_date',
        'claim_amount',
        'accident_date',
        'accident_description',
        'plan_id',
        'benefit_id',
        'claim_status',
        'reject_reason'
    ];

    protected $casts = [
        'claim_date' => 'datetime',
        'accident_date' => 'datetime',
    ];

    public function contract()
    {
        return $this->belongsTo(Contract::class, 'policy_no', 'policy_no');
    }

    public function benefit()
    {
        return $this->belongsTo(Benefit::class, 'benefit_id', 'benefit_id');
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'plan_id');
    }
}