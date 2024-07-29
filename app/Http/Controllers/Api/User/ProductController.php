<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductColorImage;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getDataByProduct(Request $request)
    {
        try {
            $product = Product::where('slug', $request->slug)->first();

            $data = [
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'discount' => $product->discount,
                'product_details' => []
            ];

            foreach ($product->productDetails as $pd) {
                if (!$pd->type) {

                    $color = $pd->color->id;

                    $images = ProductColorImage::where('product_id', $product->id)
                        ->where('color_id', $pd->color_id)
                        ->get();

                    $data['product_details']['colors'][$color] = [
                        'name' => $pd->color->name,
                        'value' => $pd->color->value,
                        'price' => $pd->price,
                        'price_discount' => $pd->price - $pd->price * ($product->discount / 100),
                        'sku' => $pd->sku
                    ];

                    $data['image'][$pd->color->name] = $images->pluck('image');
                } else {
                    $type = $pd->type->name;

                    $color = $pd->color->id;

                    if (!isset($data['product_details'][$type])) {
                        $data['product_details'][$type] = [
                            'type' => $type,
                            'colors' => []
                        ];
                    }

                    $images = ProductColorImage::where('product_id', $product->id)
                        ->where('color_id', $pd->color_id)
                        ->get();

                    $data['product_details'][$type]['colors'][$color] = [
                        'name' => $pd->color->name,
                        'value' => $pd->color->value,
                        'price' => $pd->price,
                        'price_discount' => $pd->price - $pd->price * ($product->discount / 100),
                        'sku' => $pd->sku
                    ];

                    $data['image'][$pd->color->name] = $images->pluck('image');
                }
            }

            return Message::successJson(['product' => $data], 'Lấy sản phẩm thành công');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getDataByProductDetail()
    {
        return 1;
    }

    public function findByName(Request $request)
    {
        $name = $request->input("name");
        $product = Product::where('name', 'like', "%$name%")->get();
        $product->load("productDetails", "images");
        foreach ($product as $item) {
            $item->productDetails->load("color", "type");
        }

        return ($product);
    }
}