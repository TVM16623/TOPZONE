<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'key',
        'discount',
        'start_date',
        'end_date',
        'quantity',
        'minimum',
    ];

    protected $dates = ['start_date', 'end_date', 'deleted_at'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
