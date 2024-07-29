<?php

namespace App\Http\Controllers\Api\Admin;

use App\Models\Invoice;
use App\Helpers\Message;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $status = $request->status;
            if (!empty($status)) {
                $invoices = Invoice::with(['invoiceDetails', 'user', 'payment', 'city', 'district', 'subDistrict', 'payment'])->where("status", $status)->paginate(5);
                return response()->json($invoices);
            }else{
                $invoices = Invoice::with(['invoiceDetails', 'user', 'payment', 'city', 'district', 'subDistrict', 'payment'])->paginate(5);
                return response()->json($invoices);
            }
        } catch (\Exception $e) {
            return Message::serverError($e);
        }
    }

    public function show($id){
        try {
            $invoice = Invoice::with([
                'invoiceDetails',
                'user',
                'payment',
                'city',
                'district',
                'subDistrict',
                'payment',
                'invoiceDetails.productDetail.product'
            ])->find($id);
            return response()->json($invoice);
        } catch (\Exception $e) {
            return Message::serverError($e);
        }
    }

    public function changeStatus(Request $request){
        try {
            $invoice = Invoice::with([
                'invoiceDetails',
                'user',
                'payment',
                'city',
                'district',
                'subDistrict',
                'payment',
                'invoiceDetails.productDetail.product'
            ])->find($request->id);
            $invoice->status = $request->status;
            $invoice->save();
            return response()->json($invoice);
        } catch (\Exception $e) {
            return Message::serverError($e);
        }
    }
}