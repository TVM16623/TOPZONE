<?php

namespace app\Helpers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;

class JwtHelper
{

    // Tạo refresh token
    // Payload: data muốn mã hóa
    public static function createRefreshToken()
    {
        $refreshToken = Str::random(100);
        return $refreshToken;
    }

    // Tạo access token
    public static function createAccessToken($user)
    {
        return JWTAuth::fromUser($user);
    }

    public static function User($refreshToken)
    {
        $user = User::findByToken($refreshToken);

        return $user;
    }
}
