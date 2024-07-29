<?php

namespace App\Helpers;

use Illuminate\Http\Response;
use Exception;

class Message
{
    public static $listError = [
        "server" => "Đã xảy ra lỗi! Vui lòng thử lại."
    ];
    private Response $response;

    public function __construc(Response $response)
    {
        $this->response = $response;
    }

    private static function getMessage(string $message, string $status = "success")
    {
        return ["status" => $status, "message" => $message];
    }

    public static function successJson($data, string $message = "")
    {
        return response()->json(array_merge(self::getMessage($message), ["data" => $data]));
    }

    // public static function successWithCookie($data, string $message = "", $cookie)
    // {
    //     return response()->json(array_merge(self::getMessage($message), ["data" => $data]))->cookie($cookie);
    // }

    public static function success(string $message)
    {
        return response()->json(array_merge(self::getMessage($message)));
    }

    public static function failJson(string $message, int $code = 400)
    {
        return response()->json(self::getMessage($message, "error"), $code);
    }

    public static function serverError()
    {
        return response()->json(self::getMessage("Đã xảy ra lỗi, vui lòng thử lại!", "error"), 500);
    }

    public function setMessage(string $message)
    {
        return $this->response->json(Message::getMessage($message));
    }

    public function setJson($data, string $message)
    {
        return $this->response->json(array_merge(Message::getMessage($message), ['data' => $data]));
    }

    public static function set(Response $response)
    {
        return new Message($response);
    }

    public static function catch(Exception $e)
    {
        return Message::failJson($e->getMessage());
    }
}
