<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    use HasFactory;

    protected $table = 'invoice_details';

    protected $fillable = [
        'invoice_id',
        'product_detail_id',
        'price',
        'quantity'
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function productDetail()
    {
        return $this->belongsTo(productDetail::class);
    }
    public function user_id()
    {
        return $this->belongsTo(User::class);
    }
    public function review()
    {
        return $this->hasOne(Review::class);
    }
}
