<?php

use App\Models\Invoice;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('my-private-channel.user.{$id}', function ($user, $id) {
    return $user->id === $id;
});

Broadcast::channel('invoice.{code}', function ($user, $invoiceCode) {
    $invoice = Invoice::where('code', $invoiceCode)->first();
    if ($invoice === null) return false;

    return $user->id === (int) $invoice->user_id;
});

Broadcast::channel('my-public-channel', function ($message) {
    return true;
});

Broadcast::channel('chat', function ($user) {
    return $user->is_admin === 1;
});

Broadcast::channel('invoice.{code}', function ($user, $invoiceCode) {
    $invoice = Invoice::where('code', $invoiceCode)->first();
    if ($invoice === null) return false;

    return $user->id === (int) $invoice->user_id;
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return $user->id === (int) $userId;
});
