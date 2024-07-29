<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Product;
use App\Helpers\Message;
use Illuminate\Http\Request;
use App\Models\ProductDetail;
use App\Models\ProductColorImage;
use App\Http\Controllers\Controller;
use Exception;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $products = Product::paginate(5);

            $data = [];

            foreach ($products as $product) {
                $productData = [
                    'id' => $product->id,
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

                        $productData['product_details']['colors'][$color] = [
                            'name' => $pd->color->name,
                            'value' => $pd->color->value,
                            'price' => $pd->price,
                            'stock' => $pd->stock,
                            'price_discount' => $pd->price - $pd->price * ($product->discount / 100),
                            'sku' => $pd->sku
                        ];

                        $productData['image'][$pd->color->name] = $images->pluck('image');
                    } else {
                        $type = $pd->type->name;

                        $color = $pd->color->id;

                        if (!isset($productData['product_details'][$type])) {
                            $productData['product_details'][$type] = [
                                'type' => $type,
                                'colors' => []
                            ];
                        }

                        $images = ProductColorImage::where('product_id', $product->id)
                            ->where('color_id', $pd->color_id)
                            ->get();

                        $productData['product_details'][$type]['colors'][$color] = [
                            'name' => $pd->color->name,
                            'value' => $pd->color->value,
                            'price' => $pd->price,
                            'stock' => $pd->stock,
                            'price_discount' => $pd->price - $pd->price * ($product->discount / 100),
                            'sku' => $pd->sku
                        ];

                        $productData['image'][$pd->color->name] = $images->pluck('image');
                    }
                }

                $data[] = $productData;
            }

            return response()->json([
                'data' => $data,
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total()
            ]);
        } catch (Exception $e) {
            return Message::error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            if ($request->slug) {
                $product = Product::where('slug', $request->slug)->first();
                $product->name = $request->name;
                $product->description = $request->description;
                $product->sub_category_id = $request->sub_category_id;
                $product->sub_description = $request->sub_description;
                $product->discount = $request->discount;
                $product->save();

                $detail = $request->product_details;
                foreach ($detail as $key => $value) {
                    $product_details = ProductDetail::find($value['id']);
                    $product_details->product_id = $product->id;
                    $product_details->color_id = $value['color_id'];
                    $product_details->type_id = $value['type_id'];
                    $product_details->specifications = $value['specifications'];
                    $product_details->sku = $value['sku'];
                    $product_details->price = $value['price'];
                    $product_details->stock = $value['stock'];
                    $product_details->save();

                    $product_color_images = ProductColorImage::find($value['color_image_id']);
                    $product_color_images->product_id = $product->id;
                    $product_color_images->color_id = $value['color_id'];
                    $product_color_images->image = $value['image'];
                    $product_color_images->save();
                }
                return response()->json(["message" => "Cập nhật sản phẩm thành công", "status" => 200]);
            } else {
                $product = new Product();
                $product->name = $request->name;
                $product->description = $request->description;
                $product->sub_category_id = $request->sub_category_id;
                $product->sub_description = $request->sub_description;
                $product->discount = $request->discount;
                $product->save();

                $detail = $request->product_details;
                foreach ($detail as $key => $value) {
                    $product_details = new ProductDetail();
                    $product_details->product_id = $product->id;
                    $product_details->color_id = $value['color_id'];
                    $product_details->type_id = $value['type_id'];
                    $product_details->specifications = $value['specifications'];
                    $product_details->sku = $value['sku'];
                    $product_details->price = $value['price'];
                    $product_details->stock = $value['stock'];
                    $product_details->save();

                    $product_color_images = new ProductColorImage();
                    $product_color_images->product_id = $product->id;
                    $product_color_images->color_id = $value['color_id'];
                    $product_color_images->image = $value['image'];
                    $product_color_images->save();
                }

                return response()->json(["message" => "Thêm sản phẩm thành công", "status" => 200]);
            }
        } catch (Exception $e) {
            return Message::serverError($e);
        }
    }

    public function show($slug)
    {
        try {
            $product = Product::where('slug', $slug)->first();

            $data = [
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'sub_category_id' => $product->sub_category_id,
                'sub_description' => $product->sub_description,
                'discount' => $product->discount,
                'product_details' => [], // Chứa chi tiết sản phẩm và ảnh của từng màu sắc
                'image' => [], // Chứa đường dẫn ảnh của từng màu sắc
            ];

            foreach ($product->productDetails as $pd) {
                $detail = [
                    'id' => $pd->id,
                    'color_image_id' => null, // Khởi tạo ID của product_color_image là null
                    'color_id' => $pd->color_id,
                    'image' => null,
                    'type_id' => $pd->type_id,
                    'sku' => $pd->sku,
                    'price' => $pd->price,
                    'stock' => $pd->stock,
                    'specifications' => $pd->specifications,
                ];

                // Lấy tất cả ảnh của product_color_image cho sản phẩm và màu sắc đó
                $images = ProductColorImage::where('product_id', $product->id)
                    ->where('color_id', $pd->color_id)
                    ->get();

                // Gán ảnh đầu tiên vào trường 'image' của chi tiết sản phẩm
                if ($images->isNotEmpty()) {
                    $detail['image'] = $images->first()->image;
                    $detail['color_image_id'] = $images->first()->id; // Lấy ID của ảnh đầu tiên
                }

                // Thêm chi tiết sản phẩm vào mảng 'product_details'
                $data['product_details'][] = $detail;

                // Gán tất cả ảnh vào mảng 'image' với key là tên màu sắc
                $data['image'][$pd->color->name] = $images->pluck('image');
            }

            return Message::successJson(['product' => $data], 'Lấy sản phẩm thành công');
        } catch (Exception $e) {
            return Message::serverError($e);
        }
    }

    public function delete(Request $request)
    {
        try {
            $id = $request->id;
            $product = Product::where('id', $id)->firstOrFail();
            $product->delete();
            return response()->json(["message" => "Xóa sản phẩm thành công", "status" => 200]);
        } catch (Exception $e) {
            return Message::serverError($e);
        }
    }
}