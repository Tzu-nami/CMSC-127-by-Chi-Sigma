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
        
        $books =$query->get();

        return Inertia::render('BooksDatabase/books-index', [
            'books' => $books,

            'filters'=>$request->only(['search']),
        ]);
    }

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'book_id' => 'required|max:5|string|unique:books_data,BOOK_ID',
            'book_title'=> 'required|max:255|string',
            'book_year' => 'required|digits:4|min:1901|integer|max:' . date('Y'),
            'book_publisher' => 'required|max:255|string',
            'book_copies' => 'required|integer|min:0'
        ]);

        // Create new book
        Books::create([
            'BOOK_ID' => $validated['book_id'],
            'BOOK_TITLE' => $validated['book_title'],
            'BOOK_YEAR' => $validated['book_year'],
            'BOOK_PUBLISHER' => $validated['book_publisher'],
            'BOOK_COPIES' => $validated['book_copies'],
        ]);

        return redirect()->route('booksdatabase.index')->with('success', 'Book added successfully!');

    }
}