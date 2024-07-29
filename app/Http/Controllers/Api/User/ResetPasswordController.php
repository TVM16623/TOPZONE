<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\PasswordReset;
use App\Models\User;
use App\Notifications\ResetPasswordRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{
    public function sendMail(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) return Message::failJson('Email không tồn tại trong hệ thống!');

            $passwordReset = PasswordReset::where('email', $user->email)->first();

            if (!$passwordReset) {
                /* Nếu trong table password reset chưa có thì tạo mới
                * Thời gian hết hạn token reset password là  30 phút
                * Tạo cái mới nên khỏi check hạn của token
                */
                $p = PasswordReset::create([
                    'email' => $user->email,
                    'token' => Str::random(255),
                    'expires_at' => Carbon::now()->addMinutes(intval(env('TOKEN_RESET_PASSWORD_EXPIRES_AT', 30)))
                ]);

                $token = $p->token;
            } else {
                // vào đây thì phải check hạn token
                if (Carbon::parse($passwordReset->expires_at) > Carbon::now()) {
                    // Nếu thời gian live token nhỏ hơn time current thì token đã hết hạn
                    return Message::failJson("Liên kết được gửi về mail trước đó vẫn còn hiệu lực!");
                };

                //Tạo token mới
                $token = Str::random(255);
                $passwordReset->expires_at = Carbon::now()->addMinutes(intval(env('TOKEN_RESET_PASSWORD_EXPIRES_AT', 30)));
                $passwordReset->save();
            }

            $user->notify(new ResetPasswordRequest($token));

            return Message::success("Kiểm tra hộp thư email của bạn!");
        } catch (\Throwable $th) {
            return Message::failJson($th);
        }
    }

    public function reset(Request $request, $token)
    {
        try {
            $v = Validator($request->all(), [
                'password' => 'required|min:8|max:200|confirmed',
                'password_confirmation' => 'required'
            ]);

            if ($v->fails()) return Message::failJson($v->errors()->first());

            // Kiểm tra token có trong db không
            $token_ = PasswordReset::where('token', $token)->first();

            if (!$token_) return Message::failJson("Không tìm thấy!");

            // Kiểm tra thời gian live token còn không (thời gian hết hạn < hiện tại)
            if (Carbon::parse($token_->expires_at) < Carbon::now()) return Message::failJson('Liên kết đã hết hạn, hãy yêu cầu liên kết mới');

            $user = User::findByEmail($token_->email)->first();
            $user->password = Hash::make($request->password);
            $user->email_verified_at = Carbon::now();
            $user->save();

            // Bỏ token cũ
            $token_->expires_at = Carbon::now();
            $token_->save();

            return Message::success("Đã cập nhật mật khẩu của bạn");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
}
