<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductColorImage;
use App\Models\ProductDetail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function view(Request $request)
    {
        try {
            $cart = Cart::where('user_id', $request->user->id)->get();

            $result = array();
            // Số lượng hàng trong table cart của 1 user theo product detail
            $quantity = Cart::where('user_id', $request->user->id)->count();

            foreach ($cart as $cart_item) {
                $product_detail =  ProductDetail::find($cart_item->product_detail_id);

                $p = Product::find($product_detail->product_id);

                $image = ProductColorImage::where("product_id", $product_detail->product_id)
                    ->where("color_id", $product_detail->color_id)
                    ->first();

                $result[] = [
                    "name" => $p->name,
                    "slug" => $p->slug,
                    "discount" => $p->discount,
                    'price' => $product_detail->price,
                    'price_discount' => $product_detail->price - $product_detail->price * ($p->discount / 100),
                    "type" => $product_detail->type->name,
                    "color" => $product_detail->color->name,
                    "quantity_product_in_cart" => $cart_item->quantity,
                    "sku" => $product_detail->sku,
                    "stock" => $product_detail->stock,
                    "avatar" => $image->image,
                ];
            }

            return Message::successJson([
                'data' => $result,
                'quantity' => $quantity
            ], "ok");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function create(Request $request)
    {
        try {
            $v = Validator($request->all(), [
                'sku' => 'required|string',
            ]);

            if ($v->fails()) return Message::failJson($v->errors()->first());

            $pd = ProductDetail::where('sku', $request->sku)->first();
            if (!$pd) return Message::failJson("Sản phẩm không tôn tại");

            $p = Product::where('id', $pd->product_id)->first();

            // Kiểm tra xem giỏ hàng user có sản phẩm đó chưa
            // $cart chỉ chứa data 1 hàng
            $c = Cart::where('user_id', $request->user->id)
                ->where('product_detail_id', $pd->id)
                ->first();

            $q = $c ? $c->quantity + 1 : 1;

            $cart = Cart::updateOrCreate(
                [
                    'user_id' => $request->user->id,
                    'product_detail_id' => $pd->id
                ],
                [
                    'quantity' => 1,
                ]
            );

            $cart_info = Cart::where('user_id', $request->user->id)->get();

            // Số lượng hàng trong table cart của 1 user theo product detail
            $quantity = Cart::where('user_id', $request->user->id)->count();
            $result = array();
            foreach ($cart_info as $cart_item) {
                $product_detail =  ProductDetail::find($cart_item->product_detail_id);

                $image = ProductColorImage::where("product_id", $product_detail->product_id)
                    ->where("color_id", $product_detail->color_id)
                    ->first();

                $result[] = [
                    "name" => $p->name,
                    "slug" => $p->slug,
                    "discount" => $p->discount,
                    "type" => $product_detail->type->name,
                    "color" => $product_detail->color->name,
                    "quantity_product_in_cart" => $cart_item->quantity,
                    "sku" => $product_detail->sku,
                    "stock" => $product_detail->stock,
                    "avatar" => $image->image
                ];
            }

            return Message::successJson([
                "quantity" => $quantity,
                "data" => $result
            ], "Thêm thành công");
        } catch (\Throwable $th) {
            return $th;
            return Message::serverError();
        }
    }

    public function update(Request $request)
    {
        return 1;
    }

    public function delete(Request $request)
    {
        try {
            $v = Validator($request->all(), [
                'sku' => 'required'
            ]);

            if ($v->fails()) return Message::failJson($v->errors()->first());

            $pd = ProductDetail::where('sku', $request->sku)->first();

            $cart = Cart::where('user_id', $request->user->id)
                ->where('product_detail_id', $pd->id)
                ->first();

            if (!$cart) return Message::failJson("Sku không hợp lệ!");

            $cart->delete();

            return Message::success("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
}
