<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
