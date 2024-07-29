<?php

namespace App\Http\Middleware;

use App\Helpers\Message;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class CheckTokenMiddleware
{
    /**
     * Handle aresponse = $response;response = $response;n incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {

        try {
            $user = JWTAuth::parseToken()->authenticate();
            //
            if ($user === null)
                return Message::failJson("Bạn chưa đăng nhập!");

            $request['user'] = $user;

            return $next($request);
        } catch (TokenExpiredException $e) {
            return Message::failJson("Quyền truy cập đã hết hạn!", 401);
        } catch (\Exception $e) {
            return Message::failJson("Bạn chưa đăng nhập!", 401);
        }
    }
}
