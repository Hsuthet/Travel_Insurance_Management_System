<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeclarationResult extends Model
{
    protected $fillable = [
    'customer_id',
    'declaration_id',
    'check_result',
];
}
