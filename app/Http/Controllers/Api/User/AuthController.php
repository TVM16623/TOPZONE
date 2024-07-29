<?php

namespace App\Http\Controllers\Api\User;

use App\Events\PublicChannelEvent;
use app\Helpers\JwtHelper;
use app\Helpers\Mail as HelpersMail;
use App\Helpers\Message;
use App\Helpers\StrCustom;
use App\Http\Controllers\Controller;
use App\Mail\CodeMail;
use App\Models\Code;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->all()['data'];
            $v = Validator::make($data, [
                'name' => 'required|string|min:2|max:50',
                'email' => 'required|string|email|min:5|unique:users,email|max:100',
                'password' => 'required|string|min:8|max:200|confirmed',
                'password_confirmation' => 'required'
            ]);

            $email_exist = User::where('email', $data['email'])->first();
            if ($email_exist) {
                return Message::failJson("Email đã đăng ký");
            }

            if ($v->fails())
                return Message::failJson($v->errors()->first());

            if (StrCustom::haveWhitespace($data['email']))
                return Message::failJson("Email không được chứa khoảng trắng");

            // Tạo user
            $user = new User([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password'])
            ]);

            // Tạo mã và gửi mã và lưu mã code
            // $mail = new HelpersMail();



            // $code = (string)random_int(100000, 999999);
            // $mail->sendVerificationCodeByEmail($data['email'], $code);
            // if ($mail->sendVerificationCodeByEmail($data['email'], $code) === false)
            // {
            //     return Message::failJson("Email không tồn tại!");
            // }

            $user->save();
            // Code::create([
            //     'user_id' => $user->id,
            //     'content' => $code,
            // ]);
            return Message::successJson($user, "Đăng kí thành công, hãy xác thực email");
        } catch (\Throwable $th) {
            return response()->json(['a' => $th]);
            return Message::serverError($th);
        }
    }

    public function login(Request $request)
    {
        try {
            $v = Validator::make($request->all(), [
                'email' => 'required|email|string|min:5|max:50',
                'password' =>  'required|string|min:8'
            ]);

            if ($v->fails()) return Message::failJson($v->errors()->first());

            // Tìm user với email
            // if (!User::emailVerified($request->email)) return Message::failJson("Email chưa xác thực hoặc chưa đăng kí");
            $user = User::findByEmail($request->email);

            // Check nếu không có user hoặc Password sai thì xuất lỗi
            if (!$user || !Hash::check($request->input('password'), $user->password))
                return Message::failJson("Email hoặc mật khẩu không chính xác");

            if (!$user->remember_token) {
                $user->remember_token = JwtHelper::createRefreshToken($user);
            }

            $access_token = JWTAuth::fromUser($user);
            $cookie = cookie('refresh_token', $user->remember_token, null, '+7 days', null, false, true, 'Strict');
            event(new PublicChannelEvent("hello co ng login"));
            return response()->json([
                "access_token" => $access_token,
                "token_type" => "Bearer",
                "user" => $user,
                "message" => "Đăng nhập thành công",
                "status" => "success"
            ], 200)->withCookie($cookie);
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function handleLoginGoogle(Request $request)
    {
        $v = Validator::make($request->all(), [
            "credential" => "required"
        ], [
            "credential" => "Đăng nhập google"
        ]);

        if ($v->fails()) return Message::failJson($v->errors()->first());

        try {
            $tokenParts = explode('.', $request->credential);

            // Giải mã phần payload
            $payload = base64_decode($tokenParts[1]);

            // Decode json payload
            $decodeToken = json_decode($payload, true);

            // Tìm user với email
            $user = User::where("email", $decodeToken['email'])->first();
            // Kiểm tra email user có trong csdl chưa
            // Đăng nhập lần đầu
            if (!$user) {
                $user = User::create([
                    "name" => $decodeToken['name'],
                    "email" => $decodeToken['email']
                ]);

                $user->remember_token = JwtHelper::createRefreshToken($user);
            }

            // Đã điền mail nhưng chưa xác thực
            if (!$user->remember_token)
                $user->remember_token = JWTHelper::createRefreshToken($user);

            $user->save();

            // Access token
            $access_token = JWTAuth::fromUser($user);
            $cookie = cookie('refresh_token', $user->remember_token, null, null, null, false, true, 'Strict');

            return response()->json([
                "access_token" => $access_token,
                "user" => $user,
                "message" => "Đăng nhập thành công",
                "status" => "success"
            ], 200)->withCookie($cookie);
        } catch (\Exception $e) {
            return Message::failJson("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    }

    // Dùng để lấy access token mới
    public function refresh(Request $request)
    {
        try {
            $refresh_token = $request->cookie("refresh_token");

            if (!$refresh_token) {
                return Message::failJson("Refresh token không tồn tại", 401);
            }

            if (!$user = User::findByToken($refresh_token))
                return Message::failJson("Refresh token không hợp lệ", 401);

            $access_token = JwtHelper::createAccessToken($user);

            return Message::successJson($access_token, "Lấy access token thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function handleGetInfoUser(Request $request)
    {
        try {
            return Message::successJson($request->user, "Lấy thông tin người dùng thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function handleLogout(Request $request)
    {
        try {
            $cookie = cookie('refresh_token', '', time() - 3600, null, null, false, true, 'Strict');
            return response()->json([
                "message" => "Đăng xuất thành công",
                "status" => "success"
            ])->withCookie($cookie);
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function ResetPassWord(Request $request)
    {
        $oldpasswordd = $request->input('password');
        $newpassword = $request->input('newpassword');
        $newpassword = Hash::make($newpassword);
        $user_id = $request->user->id;
        $user = User::find($user_id);
        // dd($user, Hash::make($oldpasswordd));
        try {
            if (Hash::check($oldpasswordd, $user->password)) {
                $user->password = $newpassword;
                $user->save();
            } else {
                return Message::failJson("Mật khẩu cũ không đúng", 401);
            }
        } catch (\Throwable $th) {
            return Message::serverError();
        }
        // dd($oldpasswordd, $newpassword, $user->password);
    }
    // protected function respondWithToken($token)
    // {
    //     return response()->json([
    //         'access_token' => $token
    //     ]);
    // }

    // Khi user đăng kí bằng email sẽ lưu vô db gồm:  name, email
    // Khi user xác nhận code sẽ có lưu email_verified_at

    // Khi user đăng nhập bằng gg sẽ lưu email và name, email_verified_at
    // Mật khẩu trống

    // User đăng nhâp bằng tk (đăng nhập gg) password trống sẽ kh cho phép và phải đăng kí lại
}
