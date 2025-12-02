<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Statuses;

class StatusController extends Controller
{
    public function index()
    {
        return Statuses::all();
    }
}
