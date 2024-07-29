<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\User;
use App\Helpers\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try{
            $keywords = $request->input('keywords');
            $users = User::when($keywords, function($query, $keywords) {
                return $query->where('name', 'like', '%' . $keywords . '%');
            })->paginate(5)->withQueryString();
            return response()->json($users);
        }catch(Exception $e){
            return Message::serverError($e);
        }
    }
}