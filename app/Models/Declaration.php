<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Declaration extends Model
{
    use SoftDeletes;

    protected $table = 'declarations';
    protected $primaryKey = 'declaration_id';
    protected $fillable = ['plan_id', 'description'];

    public function plan() { return $this->belongsTo(Plan::class, 'plan_id'); }
}