<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Beneficiary extends Model
{
    use SoftDeletes;

    protected $table = 'beneficiaries';
    protected $primaryKey = 'beneficiary_id';
    protected $fillable = ['name', 'email', 'phone', 'address', 'nrc', 'dob', 'gender', 'passport', 'nationality', 'occupation', 'relationship'];

    protected $casts = ['dob' => 'datetime'];
}
