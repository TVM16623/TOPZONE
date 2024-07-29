<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Type;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class TypeController extends Controller
{
    public function index()
    {
        try {
            $types = Type::all();
            return response()->json($types);
        } catch (Exception $e) {
            return Message::error($e->getMessage());
        }
    }
}