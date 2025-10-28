<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BooksDatabaseController extends Controller
{
    public function index() {
        return Inertia::render('BooksDatabase/Index', []);
    }
}
