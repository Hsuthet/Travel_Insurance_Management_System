<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BenefitType extends Model
{
    use SoftDeletes;

    protected $table = 'benefit_types';
    protected $primaryKey = 'benefittype_id';
    protected $fillable = ['benefittype_name', 'description'];
    public function benefits()
    {
        return $this->hasMany(Benefit::class, 'benefittype_id', 'benefittype_id');
    }
}
