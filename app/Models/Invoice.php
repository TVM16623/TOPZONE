<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'payment_id',
        'name',
        'code',
        'phone',
        'address',
        'city',
        'district',
        'sub_district',
        'promotion_id',
        'total',
        'note',
        'status'
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
        'address_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function invoiceDetails()
    {
        return $this->hasMany(InvoiceDetail::class);
    }

    public static function getCode($code)
    {
        return self::where("code", $code)->first();
    }

    public static function getCodeStatus(string $code, string $status)
    {
        return self::where("code", $code)->where("status", $status)->first();
    }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }
    public function city()
    {
        return $this->belongsTo(City::class, 'city');
    }
    public function district()
    {
        return $this->belongsTo(District::class, 'district');
    }
    public function subDistrict()
    {
        return $this->belongsTo(SubDistrict::class, 'sub_district');
    }
    public function review()
    {
        return $this->hasMany(Review::class);
    }
}