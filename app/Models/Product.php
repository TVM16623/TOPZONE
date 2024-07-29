<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Product extends Model
{

    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sub_category_id',
        'name',
        'description',
        'sub_description',
        'discount'
    ];

    protected $dates = ['deleted_at'];

    protected $hidden = [];

    public function productDetails()
    {
        return $this->hasMany(ProductDetail::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(subCategory::class);
    }

    public function promotions()
    {
        return $this->belongsToMany(
            Promotion::class,
            'promotion_product',
            'product_id',
            'promotion_id'
        );
        // model đích đến, name trung gian, khóa ngoại bảng trung gian hướng tới bảng hiện tại (ghi thuộc tính)
    }

    public function images()
    {
        return $this->hasMany(ProductColorImage::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->slug = static::createUniqueSlug($model->name);
        });
    }

    protected static function createUniqueSlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count++;
        }

        return $slug;
    }
}