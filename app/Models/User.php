<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = "users";

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'is_admin',
        'remember_token'
    ];

    protected $hidden = ['remember_token', 'password', 'email_verified_at'];

    // relationship
    public function codes()
    {
        return $this->hasMany(Code::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    public function invoiceDetails()
    {
        return  $this->hasMany(InvoiceDetail::class);
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public static function emailVerified($email)
    {
        $result = self::where('email', $email)->where('email_verified_at', '<>', null)->first();
        return $result ? true : false;
    }

    public static function findByEmail($email)
    {
        return self::where('email', $email)->first();
    }

    public static function findByToken($refreshToken)
    {
        return self::where('remember_token', $refreshToken)->first();
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    //

    /*
    * @return mixed
    */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
