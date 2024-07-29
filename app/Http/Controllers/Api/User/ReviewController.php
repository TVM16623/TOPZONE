<?php

namespace App\Http\Controllers\Api\User;

use App\Models\Review;
use App\Models\Invoice;
use App\Helpers\Message;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\InvoiceDetail;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function Upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imageName = time() . '.' . $request->image->extension();

        // Store the image in the 'public' disk (storage/app/public)
        $request->image->storeAs('images', $imageName, 'public');

        // Return a response or redirect
        return back()->with('success', 'Image uploaded successfully')->with('image', $imageName);
    }

    public function createReview(Request $request)
    {
        // Handle image upload
        $review = new Review();
        $review->content = $request->content;
        $review->star = $request->star;
        $review->invoice_detail_id = $request->invoice_detail_id;
        $review->user_id = $request->user_id;

        if ($request->hasFile('image')) {
            // Lưu file vào hệ thống file
            $image = $request->file('image');
            $filename = time() . '_' . $image->getClientOriginalName();
            $path = $image->storeAs('images', $filename, 'public'); // Lưu file vào thư mục 'storage/app/public/images'

            // Lưu tên file vào cơ sở dữ liệu
            $review->image = $filename;
        }
        $review->save();

        return response()->json($review, 200);
    }

    public function getReviewsByInvoiceDetailId($invoiceDetailId)
    {
        try {
            // Lấy các đánh giá của người dùng đã đăng nhập và tải mối quan hệ 'invoice'
            $reviews = DB::table('review')->where('invoice_detail_id', $invoiceDetailId)->get();
            return response()->json($reviews);
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function index()
    {
        $reviews = Review::all();
        return $reviews;
    }

    public function deleteReviewId(Request $request)
    {
        try {
            $review = DB::table('review')->where('id', $request->reviewId)->first();
            DB::table('review')->where('id', $request->reviewId)->delete();
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function update(Request $request)
    {
        // dd($request->all());
        try {
            // $validator = Validator::make($request->all(), [
            //     'content' => "required|string",
            //     'star' => ["required|regex:/^\d*(\.\d{1})?$/"],
            //     'image' => "image|mimes:jpg,jpeg,gif,png|max:2048",
            // ]);

            $review = Review::find($request->id);
            // dd($review);

            if (!$review) {
                return Message::failJson("Không tìm thấy đánh giá nào !");
            }

            $review->content = $request->content;
            $review->star = $request->star;

            if ($request->hasFile('image')) {
                // Lưu file vào hệ thống file
                $image = $request->file('image');
                $filename = time() . '_' . $image->getClientOriginalName();
                $path = $image->storeAs('images', $filename, 'public'); // Lưu file vào thư mục 'storage/app/public/images'

                // Lưu tên file vào cơ sở dữ liệu
                $review->image = $filename;
            }
            $review->save();

            return Message::successJson($review, "Cập nhật đánh giá thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
}
