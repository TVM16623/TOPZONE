<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        try {
            $banner = Banner::get();

            return Message::successJson($banner, "Lấy banner thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
}
