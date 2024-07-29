<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductColorImage extends Model
{
    use HasFactory;

    protected $table = 'product_color_images';

    protected $fillable = ['product_id', 'image', 'color_id'];

    protected $hidden = ['created_at', 'updated_at'];
}
