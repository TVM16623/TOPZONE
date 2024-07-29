<?php

use Illuminate\Support\Facades\Route;

Route::get('{path?}', function () {
    return view('layout');
})->where('path', '[a-zA-Z0-9-/]+');
