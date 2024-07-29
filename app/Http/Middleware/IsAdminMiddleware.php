<?php

namespace App\Http\Middleware;

use App\Helpers\Message;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class IsAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            //
            if ($user === null)
                return Message::failJson("Bạn chưa đăng nhập!", 401);
            // if (!$user->is_admin)
            //     return Message::failJson("Bạn không có quyền truy cập", 403);
            $request['user'] = $user;
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return Message::failJson("Quyền truy cập đã hết hạn!", 401);
        } catch (\Exception $e) {
            return Message::failJson("Bạn chưa đăng nhập!", 401);
        }

        return $next($request);
    }
}