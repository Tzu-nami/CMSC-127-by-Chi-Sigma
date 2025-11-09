<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Books;

class BooksDatabaseController extends Controller
{
    public function index()
    {
        // Fetch all books from the database and store it
        $books = Books::all();
        
        return Inertia::render('BooksDatabase/books-index', [
            'books' => $books,
        ]);
    }
}