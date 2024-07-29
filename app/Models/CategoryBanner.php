<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoryBanner extends Model
{
    use HasFactory;

    protected $table = "category_banners";

    protected $fillable = ['category_id', 'image'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
