<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{
    public function index(Request $request){
        try{
            $keywords = $request->input('keywords');
            $categories = Category::when($keywords, function($query, $keywords) {
                return $query->where('name', 'like', '%' . $keywords . '%');
            })->paginate(5)->withQueryString();
            return response()->json($categories);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function show($slug){
        try{
            $category = Category::where('slug', $slug)->firstOrFail();
            return response()->json($category);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function store(Request $request)
    {
        try{
            if($request->slug){
                $category = Category::where('slug', $request->slug)->firstOrFail();
                $category->update($request->all());
                return response()->json(["message" => "Cập nhật danh mục thành công", "status" => 200]);
            }else{
                $category = Category::create($request->all());
                return response()->json(["message" => "Thêm mới danh mục thành công", "status" => 200]);
            }
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function delete(Request $request)
    {
        try{
            $id = $request->id;
            $category = Category::where('id', $id)->firstOrFail();
            $category->delete();
            return response()->json(["message" => "Xóa danh mục thành công", "status" => 200]);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }
}