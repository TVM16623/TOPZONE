<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Banner extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'image'];

    protected $table = 'banners';

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