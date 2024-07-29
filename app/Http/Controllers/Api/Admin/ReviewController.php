<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Review;
use App\Helpers\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReviewController extends Controller
{
    public function index()
    {
        try{
            $reviews = Review::with(['user', 'productDetail', 'invoiceDetail', 'invoiceDetail.productDetail.product'])->paginate(5);
            return response()->json($reviews);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }

    public function reply(Request $request)
    {
        try{
            $review = Review::find($request->review_id);
            $review->reply = $request->reply;
            $review->save();
            return response()->json($review);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }
}