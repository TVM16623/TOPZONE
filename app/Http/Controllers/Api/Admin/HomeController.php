<?php

namespace App\Http\Controllers\Api\Admin;

use App\Helpers\Message;
use App\Helpers\StrCustom;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\District;
use App\Models\Invoice;
use App\Models\SubDistrict;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function getInvoicesMonth()
    {
        Carbon::setLocale('vi');

        try {
            $invoices = Invoice::where('status', 'DA_GIAO')
                ->whereYear('created_at', (new Carbon(Carbon::now()))->year)
                ->get()
                ->groupBy(fn ($invoice) => Carbon::parse($invoice->created_at)->format('Y-m'))
                ->map(function ($invoice) {
                    return $invoice->sum('total');
                })
                ->all();

            foreach ($invoices as $key => $invoice) {
                $temp = $invoice;
                unset($invoices[$key]);
                $key = (int) explode('-', $key)[1];
                $invoices[$key] = $temp;
            }

            $results = [];
            for ($i = 1; $i <= 12; $i++) {
                if (isset($invoices[$i])) {
                    $results[] = [
                        'month' => $i, // Thêm tháng vào mỗi phần tử
                        'revenue' => $invoices[$i], // Tổng doanh thu cho tháng
                    ];
                    continue;
                }
                $results[] = [
                    'month' => $i, // Thêm tháng vào mỗi phần tử
                    'revenue' => 0, // Tổng doanh thu cho tháng là 0 nếu không có hóa đơn
                ];
            }
            return $results;
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    function getUsersSources()
    {
        try {
            $users = User::get()
                // ->groupBy(fn ($user) => $user->userSocial !== null ? $user->userSocial->social->name : 'trực tiếp')
                // ->map(fn ($user) => $user->count())
                ->all();

            return $users;
        } catch (\Throwable $th) {
            return Message::serverError();
        }
    }

    public function getOrderNewest()
    {
        try {
            $orders = Invoice::orderBy('id', 'desc')->take(15)->get()
                ->load(['city', 'district', 'subDistrict'])
                ->transform(function ($order) {
                    return [
                        'Người mua' => $order->user->name,
                        'Địa chỉ' => City::find($order->city)->name
                            . ", " . District::find($order->district)->name
                            . " ," . SubDistrict::find($order->sub_district)->name
                            . ' ,' . $order->address,
                        'Tổng tiền' => number_format($order->total, 0, '.', ','),
                        'Trạng thái' => $order->status,
                        'Mã GG' => $order->promotion ? $order->promotion->discount : 0,
                        'Thanh toán' => $order->payment->name
                    ];
                });

            return $orders;
        } catch (\Throwable $th) {
            return $th;
            return Message::serverError($th);
        }
    }

    function getReports()
    {
        try {
            return [
                'earnings' => $this->getInvoicesMonth(),
                'users' => $this->getUsersSources(),
                // 'order_newest' => $this->getOrderNewest()
            ];
        } catch (\Throwable $th) {
            return $th;
        }
    }
}
