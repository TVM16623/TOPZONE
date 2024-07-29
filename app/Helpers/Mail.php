<?php

namespace app\Helpers;

use App\Mail\CodeMail;
use App\Models\Code;
use App\Models\User;
use Illuminate\Support\Facades\Mail as Maila;

class Mail
{
    public function sendVerificationCodeByEmail(string $email, string $code)
    {
        try {
            Maila::to($email)->send(new CodeMail($code));
            return $code;
        } catch (\Throwable $th) {
            return false;
        }
    }
}
