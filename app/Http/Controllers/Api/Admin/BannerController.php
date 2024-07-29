<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Banner;
use App\Helpers\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BannerController extends Controller
{

    public function index(Request $request)
    {
        try{
            $banners = Banner::paginate(5);
            return response()->json($banners);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function show($slug){
        try{
            $banner = Banner::where('slug', $slug)->firstOrFail();
            return response()->json($banner);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function store(Request $request)
    {
        try{
            if($request->slug){
                $banner = Banner::where('slug', $request->slug)->firstOrFail();
                $banner->update($request->all());
                return response()->json(["message" => "Cập nhật banner thành công", "status" => 200]);
            }else{
                $banner = Banner::create($request->all());
                return response()->json(["message" => "Thêm mới banner thành công", "status" => 200]);
            }
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function delete(Request $request)
    {
        try{
            $id = $request->id;
            $banner = Banner::where('id', $id)->firstOrFail();
            $banner->delete();
            return response()->json(["message" => "Xóa banner thành công", "status" => 200]);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }
}