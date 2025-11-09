<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BooksDatabaseController extends Controller
{
    public function index()
    {
        $books = DB::select('SELECT * FROM books_data');
        
        return Inertia::render('BooksDatabase/books-index', [
            'books' => $books
        ]);
    }
}