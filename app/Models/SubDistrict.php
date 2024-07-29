<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubDistrict extends Model
{
    use HasFactory;
    protected $hidden = ['created_at', 'updated_at'];
    protected $table = 'sub_districts';
    protected $fillable = ['name', 'district_id'];

    public function districts()
    {
        return $this->belongsTo(District::class);
    }
}
