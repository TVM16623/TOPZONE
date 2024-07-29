<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Color extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'value'
    ];

    protected $dates = ['deleted_at'];

    public function productDetails()
    {
        return $this->hasMany(ProductDetail::class);
    }
}