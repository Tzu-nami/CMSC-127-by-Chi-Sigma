<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffDatabaseController extends Controller
{
    public function index() {
        return Inertia::render('StaffDatabase/staff-index', []);
    }
}
