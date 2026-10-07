<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

//Route::inertia('/', 'Welcome')->name('home');
Route::get('/', [TestController::class, 'index']);

