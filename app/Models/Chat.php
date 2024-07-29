<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;
    protected $fillable = [
        'ip',
        'seen',
        'user_id',
        'name',
    ];

    protected $hiddent = [
        'created_at',
        'updated_at',
    ];

    public function details()
    {
        return $this->hasMany(ChatDetail::class);
    }
}
