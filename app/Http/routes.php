<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/
Route::post('/todo','TodoController@store');

Route::get('/', function () {
    return view('welcome');
});

// for languages
Route::get('language/{locale}', function ($locale ='en'){
    session()->put('locale', $locale);
    return back();
});

