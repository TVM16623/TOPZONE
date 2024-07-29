<?php

namespace App\Http\Controllers\Api\User;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Chat;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function fetchMessages()
    {
        return Chat::all();
    }

    public function sendMessage(Request $request)
    {
        $message = Chat::create([
            'user' => $request->user,
            'message' => $request->message
        ]);

        // broadcast(new MessageSent($message))->toOthers();

        return ['status' => 'Message Sent!'];
    }
}
