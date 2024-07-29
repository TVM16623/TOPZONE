<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromotionController extends Controller
{
    public function check(Request $request)
    {
        try {
            $promo = Promotion::where('key', $request->code)->first();
            if (!$promo)
                return response()->json([
                    'message' => "Mã giảm giá không hợp lệ!",
                    'status' => 'error'
                ]);

            if ($promo->quantity === 0)
                return response()->json([
                    'message' => "Đã hết lượt sử dụng!",
                    'status' => 'error'
                ]);

            $start_date = Carbon::parse($promo->start_date);
            $end_date = Carbon::parse($promo->end_date);

            // Thời gian start nhỏ hơn thời gian hiện tại
            if (!$start_date->lt(Carbon::now()))
                return response()->json([
                    'message' => "Chưa đến thời gian sử dụng!",
                    'status' => 'error',
                ]);

            // thời gian hiện tại bé hơn time kết thúc
            if (!Carbon::now()->lt($promo->end_date))
                return response()->json([
                    'message' => "Mã đã hết hạn!",
                    'status' => 'error'
                ]);

            // Đơn hàng có giá tối thiểu để áp dụng mã giảm giá
            if ($promo->minimum > $request->price)
                return response()->json([
                    'message' => "Mã áp dụng cho đơn tối thiểu " . number_format($promo->minimum, 0, ' ', '.') . " !",
                    'status' => 'error',
                ]);
            // Giảm số lượng mã giảm giá
            $promo->quantity -= 1;
            $promo->save();

            return response()->json([
                'message' => "thành công",
                'status' => 'success',
                'data' => [
                    'discount' => $promo->discount,
                    'quantity' => $promo->quantity
                ]
            ]);
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
    public function view(Request $request)
    {
        $data = Promotion::get();
        return $data;
    }
}
