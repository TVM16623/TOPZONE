<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Invoice;
use App\Helpers\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class StatisticController extends Controller
{
    public function index(){
        try{
            $today = Carbon::today();
            $totalAmount = Invoice::whereDate('created_at', $today)
                                  ->sum('total');
            $totalOrders = Invoice::whereDate('created_at', $today)->count();
            $invoices = Invoice::with(['invoiceDetails', 'user', 'payment', 'city', 'district', 'subDistrict', 'payment'])->whereDate('created_at', $today)->get();
            $totalUsers = User::where('is_admin', 0)->count();
            return response()->json(['totalAmountToday' => $totalAmount, 'totalOrdersToday' => $totalOrders, 'totalUsers' => $totalUsers, 'invoices' => $invoices], 200);
        }catch(Exception $e){
            return Message::serverError();
        }
    }
}