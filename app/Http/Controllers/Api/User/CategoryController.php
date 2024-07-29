<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getCategory()
    {
        try {
            $categories = Category::get();

            return Message::successJson($categories, "Lấy danh mục thành công");
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function getDataBySubCategory(Request $request)
    {
        try {
            $subCat = SubCategory::where('slug', $request->slug)->with('products.productDetails.type')->first();
            $products = $subCat->products;
            $data = [];
            foreach ($products as $index => $p) {
                $data[$index] = [
                    'name' => $p->name,
                    'avatar' => $p->images->map(function ($image) {
                        return $image->image;
                    })
                ];

                foreach ($p->productDetails as $pd) {
                    $prod = &$data[$index]['product_details'];

                    $prod[$pd->type->name]  = [
                        'name' => $pd->type->name,
                        'price' => $pd->price
                    ];
                }
            }

            return Message::successJson(['product' => $data], 'Lấy sub category thành công');
        } catch (\Throwable $th) {
            return $th;
            return Message::serverError();
        }
    }

    public function getDataByCategory(Request $request)
    {
        try {
            $cat = Category::where('slug', $request->slug)->first();
            if (!$cat) return Message::failJson("Không tìm thấy danh mục");
            $subCat = SubCategory::where('category_id', $cat->id)->get();

            $products = $cat->subCategories->flatmap(function ($sc) {
                return $sc->products;
            });

            $data = [];
            foreach ($products as $index => $p) {
                $data[$index] = [
                    'name' => $p->name,
                    'avatar' => $p->images->map(function ($image) {
                        return $image->image;
                    }),
                    'slug' => $p->slug
                ];

                foreach ($p->productDetails as $key => $pd) {
                    $prod = &$data[$index]['product_details'];

                    if (!$pd->type) {
                        $prod[''] = [
                            // 'name' => $pd->type->name,
                            'price' => $pd->price
                        ];
                    } else {
                        $prod[$pd->type->name]  = [
                            'name' => $pd->type->name,
                            'price' => $pd->price
                        ];
                    }
                }
            }

            return Message::successJson([
                'product' => $data,
                'sub_category' => $subCat,
                'banner' => $cat->banners,
                'logo_category' => $cat->logo,
                'name_category' => $cat->name,
            ], 'Lấy sản phẩm và danh mục con của danh mục mẹ thành công');
        } catch (\Throwable $th) {
            return $th;
            return Message::serverError($th);
        }
    }

    public function getProductByCategory(Request $request)
    {
        return 1;
    }
}
