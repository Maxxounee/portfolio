<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Test;

class TestController extends Controller {
    public function index() {
        return Inertia::render('Test', []);
    }

    public function test() {
        $test = request()->all();
        //        var_dump($test);
        if (isset($test["abc"])) {
            Test::create([
                             "text" => $test["abc"],
                         ]);
            return response("Все окс. Поле «abc» (" . $test["abc"] . ") записано в БД", 200);
        } else {
            return response("Все плохо. Отсутствует поле «abc»", 300);
        }
    }
}
