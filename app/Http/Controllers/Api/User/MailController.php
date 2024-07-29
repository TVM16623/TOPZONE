<?php

namespace App\Http\Controllers\Api\User;

use app\Helpers\JwtHelper;
use App\Helpers\Message;
use App\Helpers\StrCustom;
use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MailController extends Controller
{
    public function verifyRegister(Request $request)
    {
        try {
            $v = Validator::make($request->all(), [
                'email' => 'required|string|email|min:10|max:100',
                'otp' => 'required|size:6'
            ]);

            // Xuất lỗi validate
            if ($v->fails()) return Message::failJson($v->errors()->first());

            // Kiểm tra lỗi email có khoảng trắng và xuất lỗi
            if (StrCustom::haveWhitespace($request->email))
                return Message::failJson("Email không hợp lệ");

            // Tìm user bằng email
            $user = User::findByEmail($request->email);

            // Xuất lỗi nếu có
            if (!$user) return Message::failJson("Email không tồn tại");

            // Lấy code mới nhất của người dùng
            $code = $user->codes()->orderBy('id', 'desc')->first()->content;
            // Kiểm tra otp trong request có trong db hay không

            if ($request->otp !== $code)
                return Message::failJson("Code không hợp lệ");

            $user->email_verified_at = Carbon::now();

            // Kiểm tra hoàn tất
            // Tạo refresh token và trả về cho clients
            $refresh_token = JwtHelper::createRefreshToken();
            $access_token = JwtHelper::createAccessToken($user);
            $user->remember_token = $refresh_token;

            $cookie = cookie('refresh_token', $refresh_token, null, null, null, false, true, 'Strict');

            $user->save();

            return response()->json([
                "access_token" => $access_token,
                "user" => $user,
                "message" => "Đăng nhập thành công",
                "status" => "success"
            ], 200)->withCookie($cookie);
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }


    // Kiểm tra code có hợp lệ và còn hạn sử dụng không, valid -> true
    protected function checkMailCodeValidity($codeMail)
    {
        $mail_ttl = intval(env('MAIL_TTL', 15)); // Số phút mà email có thể được sử dụng (hợp lệ)

        $expTime = $codeMail->created_at->copy()->addMinutes($mail_ttl);

        if (Carbon::now()->greaterThanOrEqualTo($expTime)) return false;
        return true;
    }
}
