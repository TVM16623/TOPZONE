<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $hidden = ['created_at', 'updated_at'];
    protected $table = 'cities';
    protected $fillable = ['name'];

    public function districts()
    {
        return $this->hasMany(District::class);
    }
}
