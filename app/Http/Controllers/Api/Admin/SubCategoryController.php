<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\Message;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SubCategoryController extends Controller
{

    public function index()
    {
        try{
            $subCategories = SubCategory::all();
            return response()->json($subCategories);
        }catch(Exception $e){
            return Message::serverError();
        }
    }
}