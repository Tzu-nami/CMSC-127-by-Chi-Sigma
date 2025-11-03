<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowersDatabaseController extends Controller
{
    public function index() {
        return Inertia::render('BorrowersDatabase/borrowers-index', []);
    }
}
