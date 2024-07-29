<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'invoice_detail_id',
        'content',
        'star',
        'reply',
        'image',
    ];

    protected $table = 'review';
    protected $dates = ['deleted_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function productDetail()
    {
        return $this->belongsTo(ProductDetail::class);
    }
    public function invoiceDetail()
    {
        return $this->belongsTo(InvoiceDetail::class, 'invoice_detail_id');
    }
    public function invoice()
    {
        return $this->hasMany(Invoice::class);
    }
}
