<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    private string $ip;
    public string $message;
    /**
     * Create a new event instance.
     */
    public function __construct(string $ip, string $chat)
    {
        $this->ip = $ip;
        $this->message = $chat;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat'),
            new Channel('chat.' . $this->ip)
        ];
    }
}
