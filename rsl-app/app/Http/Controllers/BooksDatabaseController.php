<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BooksDatabaseController extends Controller
{
    public function index() {
        return Inertia::render('BooksDatabase/books-index', []);
    }

    function books() {
        $books = DB::select('SELECT * FROM books_data');
        return view('books-database.books-index', ['books' => $books]);
    }
}
