<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    public function update(Request $request)
    {
        try {
            // $v = Validator($request->all(), [
            //     "name" => 'required|string|between:2,50',
            //     "phone" => 'required|string|between:9,11',
            //     "birthday" => 'required|date|before:now|after:1920-01-01',
            // ]);

            // if ($v->fails()) return Message::failJson($v->errors()->first());
            // dd($request->all());
            $phone_exist = User::where("phone", $request->phone)->first();
            if ($phone_exist) return Message::failJson("Số điện thoại đã tồn tại");

            $user = $request->user;
            $user->name = $request->name;
            $user->phone = $request->phone;
            $user->birthday = $request->birthday;

            $user->save();
            return Message::successJson($user, "Cập nhật thông tin tài khoản thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
}
