<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'chat_id',
        'customer',
        'message'
    ];

    protected $hiddent = [];

    public function chat()
    {
        return $this->belongsTo(Chat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
