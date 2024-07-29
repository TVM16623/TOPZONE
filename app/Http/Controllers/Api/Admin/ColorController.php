<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Color;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ColorController extends Controller
{
    public function index(Request $request){
        try{
            $keywords = $request->input('keywords');
            $colors = Color::when($keywords, function($query, $keywords) {
                return $query->where('name', 'like', '%' . $keywords . '%');
            })->paginate(5)->withQueryString();
            return response()->json($colors);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function getAll(){
        try{
            $colors = Color::all();
            return response()->json($colors);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function show($id){
        try{
            $color = Color::where('id', $id)->firstOrFail();
            return response()->json($color);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function store(Request $request)
    {
        try{
            if($request->id){
                $color = Color::where('id', $request->id)->firstOrFail();
                $color->update($request->all());
                return response()->json(["message" => "Cập nhật màu thành công", "status" => 200]);
            }else{
                $color = Color::create($request->all());
                return response()->json(["message" => "Thêm mới màu thành công", "status" => 200]);
            }
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function delete(Request $request)
    {
        try{
            $id = $request->id;
            $color = Color::where('id', $id)->firstOrFail();
            $color->delete();
            return response()->json(["message" => "Xóa màu thành công", "status" => 200]);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }
}