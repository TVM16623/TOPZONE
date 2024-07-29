<?php

namespace App\Console\Commands;

use App\Events\PaymentEvent;
use App\Events\PublicChannelEvent;
use App\Models\Invoice;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Payment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cron:payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $output = new \Symfony\Component\Console\Output\ConsoleOutput();

        $API_KEY = env("BANK_KEY");
        $response = Http::get("http://207.148.124.146/api/secure/{$API_KEY}");

        Log::info($API_KEY);

        if ($response->status() !== 200 || $response['status'] !== 'success') {
            Log::info($response->status());
            return;
        }

        $dataList = $response['data'];
        foreach ($dataList as $data) {
            // Tìm xem phải nội dung thanh toán không
            $check = str_contains($data["description"], "TOPZONE");
            if (!$check) continue; // bỏ qua phần lăp hiện tại, tiếp tục phần tử each tiếp theo

            $des = explode("TOPZONE ", $data['description'], 2);

            // Xóa khoảng trắng-> cắt lấy code hóa đơn.
            $code_invoice = substr(str_replace(" ", "", $des[1]), 0, 10);

            Log::info("result:" . $code_invoice);

            $invoice = Invoice::getCodeStatus($code_invoice, "DA_DAT");

            if (!$invoice) {
                Log::info($code_invoice);
                if ($invoice->status === "DA_THANH_TOAN") return; // Đã thanh toán thì bỏ qua
                try {
                } catch (\Throwable $e) {
                    Log::info('Không tìm thấy!');
                    return;
                }
            }

            Log::info("Tổng tiền: " . $invoice->total);

            if ($invoice->total !== (int) $data["creditAmount"]) {
                //Tiền chuyển không trùng với tiền cần thanh toán
                return;
            }

            event(new PaymentEvent($invoice, [
                "status" => "success",
                "message" => "Thành công"
            ]));

            $invoice->status = "DA_THANH_TOAN";
            $invoice->save();
        }
    }
}
