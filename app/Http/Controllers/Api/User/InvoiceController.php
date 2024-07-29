<?php

namespace App\Http\Controllers\Api\User;

use App\Helpers\Message;
use App\Helpers\StrCustom;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\Payment;
use App\Models\ProductDetail;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Validator;

class InvoiceController extends Controller
{
    public function create(Request $request)
    {
        try {
            $v = Validator($request->all(), [
                'product' => 'array|min:1',
                'product.sku' => "string",
                'product.quantity_product_in_cart' => 'min:1|max:1000',
                'address.phone' => 'min:9|max:11',
                'address.note' => 'max:54',
                'address.address' => 'required|max:100',
                'isSave' => 'boolean',
                'address.name' => 'min:2|max:50',
                'address.payment_id' => 'required|numeric',
            ]);

            if ($v->fails()) return Message::failJson($v->errors()->first());
            // check address
            $checkAddress = StrCustom::checkAddress($request->address);
            if (!$checkAddress) return Message::failJson("Điạ chỉ không hợp lệ!");

            $i = Invoice::latest('id')->first();
            $invoice = new Invoice();
            // Check payment method
            $payment = Payment::where("id", $request->address['payment_id'])->first();
            if (!$payment) return Message::failJson("Không tìm thấy phương thức thanh toán!");
            // dd($request->address);
            $invoice->payment_id = $payment->id;
            $invoice->user_id = $request->user->id;
            $invoice->phone = $request->address['phone'];
            $invoice->note = $request->address['address'];
            $invoice->address = $request->address['address'];
            $invoice->city = $request->address['city'];
            $invoice->district = $request->address['district'];
            $invoice->sub_district = $request->address['sub_district'];
            $invoice->status = "DA_DAT";
            $invoice->name = $request->address['name'];

            $array_invoice_detail = [];
            $price_invoice_total = 0;

            // Check product
            foreach ($request->product as $product) {
                $pd =  ProductDetail::where('sku', $product['sku'])->first();
                // Kiểm tra sl sản phẩm trong giỏ hàng
                if ($product['quantity_product_in_cart'] < 1 || $product['quantity_product_in_cart'] > $pd->stock)
                    return Message::failJson("Số lượng sản phẩm không hợp lệ!");

                $pricePro = 0; // Gía của 1 sản phẩm product_detail , sl là 1
                if ($pd->product->discount) {
                    $pricePro = $pd->price * ((100 - $pd->product->discount) / 100);
                } else {
                    $pricePro = $pd->price;
                }

                $price_invoice_total += $pricePro * $product['quantity_product_in_cart'];

                $id_invoice_unique = $i ? $i->id + 1 : 1;

                $array_invoice_detail[] = [
                    'invoice_id' => null,
                    'product_detail_id' => $pd->id,
                    'price' => $pricePro * $product['quantity_product_in_cart'],
                    'quantity' => $product['quantity_product_in_cart']
                ];

                $pd->stock -= $product['quantity_product_in_cart'];
                $pd->save();
            }
            // return response()->json(['data' => $array_invoice_detail]);
            // check mã giảm giá
            $havePromo = false;
            if ($request->address['code'] !== "" && $request->address['code'] !== null) {
                $havePromo = true;
                $promo = $this->isPromotion($request->address['code'], $price_invoice_total);

                if (!$promo) $havePromo = false;
            }

            if ($havePromo) {
                // $invoice->promotion_id = $promo->id;
                $price_invoice_total -= $promo->discount;
                $invoice->promotion_id = $promo->id;
                // Giảm lượt sl mã giảm giá
                $promo->quantity -= 1;
                // Lưu thay đổi vào cơ sở dữ liệu
                $promo->save();
                // Lưu hóa đơn sau khi cập nhật tổng tiền
            }
            $invoice->id = $id_invoice_unique;
            $invoice->code = Str::random(10);
            $invoice->total = $price_invoice_total;
            $invoice->save();
            foreach ($array_invoice_detail as &$detail) {
                $detail['invoice_id'] = $invoice->id; // Cập nhật invoice_id của invoice_Detail sau khi hóa đơn được lưu
            }
            // Xóa giỏ hàng
            $request->user->carts()->delete();
            // Tạo product detail
            $invoice_detail = InvoiceDetail::insert($array_invoice_detail);
            $payOnl = Payment::where("name", "like", "%ngân hàng%")->first();
            $isPaymnetOnline = false;
            if ($payOnl->id === $invoice->payment->id) $isPaymnetOnline = true;
            return Message::successJson([
                'isPaymentOnline' => $isPaymnetOnline,
                'idInvoice' => $invoice->code
            ], "Đặt hàng thành công");
        } catch (\Throwable $th) {
            return Message::failJson($th);
        }
    }

    public function isPromotion($code = null, $price = 0)
    {
        try {
            if ($code == null || $code == "") return false;
            $promo = Promotion::where('key', $code)->first();
            if (!$promo)
                return false;

            if ($promo->quantity === 0)
                return false;

            $start_date = Carbon::parse($promo->start_date);

            // Thời gian start nhỏ hơn thời gian hiện tại
            if (!$start_date->lt(Carbon::now()))
                return false;

            // thời gian hiện tại bé hơn time kết thúc
            if (!Carbon::now()->lt($promo->end_date))
                return false;

            // Đơn hàng có giá tối thiểu để áp dụng mã giảm giá
            if ($promo->minimum > $price)
                return false;

            return $promo;
        } catch (\Throwable $th) {
            return false;
        }
    }
    public function getInvoiceCodeByDetail(Request $request)
    {
        try {
            // Validate the request to ensure product_id is provided
            $request->validate([
                'product_id' => 'required|integer',
            ]);

            // Find the invoice detail by product_id
            $invoiceDetail = InvoiceDetail::where('product_detail_id', $request->product_id)
                ->with('invoice')
                ->first();

            // Check if the invoice detail exists
            if ($invoiceDetail === null) {
                throw new Exception("Không tìm thấy chi tiết hóa đơn!");
            }

            // Retrieve the related invoice
            $invoice = $invoiceDetail->invoice;

            // Check if the invoice exists
            if ($invoice === null) {
                throw new Exception("Không tìm thấy hóa đơn!");
            }

            // Return the invoice code
            return response()->json(['invoice_code' => $invoice->code]);
        } catch (\Exception $e) {
            // Handle any exceptions and return an error response
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }
    public function getInvoiceBankPending(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'code' => 'required|string|min:5|max:20'
        ]);

        if ($validate->fails())
            return Message::failJson($validate->errors()->first());

        try {
            $payment = Payment::where("name", "LIKE", "%ngân hàng%")->first();
            if (!$payment)
                throw new Exception("Không tìm thấy phương thức thanh toán!");

            $invoice = $payment->invoices()
                ->where("code", $request->code)
                ->where("status", "DA_DAT")
                ->where("user_id", $request->user->id)
                ->first();

            if ($invoice === null || $invoice->user_id !== $request->user->id)
                throw new Exception("Không tìm thấy hóa đơn cần thanh toán!");

            return Message::successJson([
                "invoice" => $invoice,
                "payment" => [
                    "name" => env("FPay_USERNAME"),
                    "accountNumber" => env("FPay_ACCOUNT_NUMBER"),
                    "bankName" => env("FPay_Bank")
                ]
            ], "Lấy dữ liệu thành công!");
        } catch (\Exception $e) {
            return Message::catch($e);
        }
    }
    public function view(Request $request)
    {
        try {
            // Truy vấn SQL sử dụng model
            $invoices = $request->user->invoices()->orderByDesc("created_at")->paginate(5);
            return $invoices;
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }
    public function getInvoiceProduct(Request $request)
    {
        // $invoice = DB::table('invoice')
        // ->join ('invoice_details', 'invoice.id', '=' ,'invoice_details.invoice_id' )
        // ->join ('product_details', 'invoice_details.product_detail_id', '=' ,'product_details.id' )
        // ->select('invoice_details.price','invoice_details.quantity','product_details.name','product_details.image')
        $invoice = $request->user->invoices->load('invoiceDetails', 'invoiceDetails.productDetail', 'invoiceDetails.productDetail.product', 'invoiceDetails.productDetail.product.images', 'city', 'district', 'subDistrict', 'invoiceDetails.review', 'promotion');
        return $invoice;
    }
    public function CancelInvoice(Request $request)
    {
        $invoice = $request->user->invoices()->find($request->input("invoice_id"));
        $invoice->status = "DA_HUY";
        $invoice->save();

        return response("Đã hủy thành công");
    }
    public function updateInfoInvoice(Request $request)
    {
        $invoice = $request->user->invoices()->find($request->input("invoice_id"));
        $payment_id = $request->input('payment_id');
        $phone = $request->input('phone');
        $address = $request->input('address');
        $city = $request->input('city');
        $districts = $request->input('district');
        $sub_district = $request->input('sub_district');
        $note = $request->input('note');
        $promotion_id = $request->input('promotion_id');
        $name = $request->input('name');

        $invoice->payment_id = $payment_id;
        $invoice->phone = $phone;
        $invoice->address = $address;
        $invoice->city = $city;
        $invoice->district = $districts;
        $invoice->sub_district = $sub_district;
        $invoice->note = $note;
        $invoice->promotion_id = $promotion_id;
        $invoice->name = $name;

        $invoice->save();

        return response("Đã thay đổi thông tin thành công");
    }
    public function getByInvoiceId(Request $request)
    {
        $invoice = $request->user->invoices()->find($request->query("invoice_id"));
        return $invoice;
    }
}
