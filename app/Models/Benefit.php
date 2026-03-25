<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Benefit extends Model
{
    use HasFactory;

    protected $table = 'benefits';

    protected $fillable = [
        'plan_id',
        'benefittype_id',
        'max_coverage',
    ];

    /**
     * Relationship: A Benefit belongs to a Plan.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    /**
     * Relationship: A Benefit belongs to a Benefit Type.
     */
    public function benefitType(): BelongsTo
    {
        return $this->belongsTo(BenefitType::class, 'benefittype_id');
    }
   
}
