<?php

use App\Models\User;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'isUser' => \App\Http\Middleware\LoggedMiddleware::class,
            'isGuest' => \App\Http\Middleware\GuestMiddleware::class,
            'checkToken' => \App\Http\Middleware\CheckTokenMiddleware::class,
            'IsAdmin' => \App\Http\Middleware\IsAdminMiddleware::class
        ]);
        // alias: tạo bí danh cho middleware để sử dụng cho routing.
        // logged: đã đăng nhập mới cho tiếp tục
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
