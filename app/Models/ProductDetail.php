<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDetail extends Model
{
    use HasFactory;

    protected $table = 'product_details';

    protected $fillable = [
        'product_id',
        'color_id',
        'type_id',
        'product_detail_code',
        'sku',
        'price',
        'stock',
        'specifications',
    ];

    protected $hidden = ['product_id', 'color_id', 'type_id', 'updated_at'];

    public function color()
    {
        return $this->belongsTo(Color::class);
    }

    public function type()
    {
        return $this->belongsTo(Type::class);
    }

    // public function Images()
    // {
    //     return $this->hasMany(ProductDetailImage::class, 'product_detail_code', 'code_image');
    // }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function invoiceDetails()
    {
        return $this->hasMany(InvoiceDetail::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
