<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Books;

class BooksDatabaseController extends Controller
{
    public function index(Request $request)
    {

        $query = Books::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('BOOK_TITLE', 'like', "%{$search}%")
                ->orWhere('BOOK_PUBLISHER', 'like', "%{$search}%")
                ->orWhere('BOOK_ID', 'like', "%{$search}%")
                ->orWhere('BOOK_YEAR', 'like', "%{$search}%");

        }); 

        // Fetch all books from the database and store it
        //$books = Books::all();
        
        $books =$query->get();

        return Inertia::render('BooksDatabase/books-index', [
            'books' => $books,

            'filters'=>$request->only(['search']),
        ]);
    }
}