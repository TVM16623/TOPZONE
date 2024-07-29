<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Promotion;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PromotionController extends Controller
{
    public function index(Request $request)
    {
        try{
            $promotions = Promotion::paginate(5);
            return response()->json($promotions);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function show($id){
        try{
            $promotion = Promotion::where('id', $id)->firstOrFail();
            return response()->json($promotion);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function store(Request $request)
    {
        try{
            if($request->id){
                $promotion = Promotion::where('id', $request->id)->firstOrFail();
                $promotion->update($request->all());
                return response()->json(["message" => "Cập nhật phiếu giảm giá thành công", "status" => 200]);
            }else{
                $promotion = Promotion::create($request->all());
                return response()->json(["message" => "Thêm mới phiếu giảm giá thành công", "status" => 200]);
            }
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function delete(Request $request)
    {
        try{
            $id = $request->id;
            $promotion = Promotion::where('id', $id)->firstOrFail();
            $promotion->delete();
            return response()->json(["message" => "Xóa phiếu giảm giá thành công", "status" => 200]);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }
}