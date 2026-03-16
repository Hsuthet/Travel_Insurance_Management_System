<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $table = 'customers';
    protected $primaryKey = 'customer_id';
    protected $fillable = ['name', 'email', 'phone', 'address', 'nrc', 'dob', 'gender', 'passport', 'nationality', 'occupation', 'item'];

    protected $casts = ['dob' => 'date'];

   
    public function contracts() {
        return $this->hasMany(Contract::class, 'customer_id');
    }
}
