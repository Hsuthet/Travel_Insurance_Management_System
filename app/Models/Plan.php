<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use SoftDeletes;

    protected $table = 'plans';
    protected $primaryKey = 'plan_id';
    protected $fillable = ['plan_name', 'price', 'duration_days'];

    public function benefits() {
        return $this->hasMany(Benefit::class, 'plan_id');
    }
}
