<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Books;
use App\Models\Authors;
use App\Models\Genres;

class BooksDatabaseController extends Controller
{
    public function index(Request $request)
    {

        $query = Books::query();

        $booksTable = (new Books)->getTable();

        // Joins for Authors and Genres
        $query->with([
            'authors:AUTHOR_ID,AUTHOR_FIRSTNAME,AUTHOR_MIDDLEINITIAL,AUTHOR_LASTNAME',
            'genres:GENRE_ID,GENRE_NAME',
        ]);

        $query->withCount('currentLoans');

        $query->when($request->input('search'), function ($query, $search) use ($booksTable) {
            // Group all search conditions in a parent 'where' to ensure 'OR' logic works correctly
            $query->where(function($q) use ($search, $booksTable) {
                $q->where("{$booksTable}.BOOK_TITLE", 'like', "%{$search}%")
                    ->orWhere("{$booksTable}.BOOK_PUBLISHER", 'like', "%{$search}%")
                    ->orWhere("{$booksTable}.BOOK_ID", 'like', "%{$search}%")
                    ->orWhere("{$booksTable}.BOOK_YEAR", 'like', "%{$search}%")

                    // CORRECTED: Use orWhereHas to search in related 'authors' table
                    ->orWhereHas('authors', function ($authorQuery) use ($search) {
                        $authorQuery->where('AUTHOR_FIRSTNAME', 'like', "%{$search}%")
                                    ->orWhere('AUTHOR_MIDDLEINITIAL', 'like', "%{$search}%")
                                    ->orWhere('AUTHOR_LASTNAME', 'like', "%{$search}%");
                    })
                    
                    // CORRECTED: Use orWhereHas to search in related 'genres' table
                    ->orWhereHas('genres', function ($genreQuery) use ($search) {
                        $genreQuery->where('GENRE_NAME', 'like', "%{$search}%");
                    });
            });
        });
        $books = $query->get();
        $authors = Authors::all();
        $genres = Genres::all();

        return Inertia::render('BooksDatabase/books-index', [
            'books' => $books,
            'authors' => $authors,
            'genres' => $genres,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'book_id' => 'required|max:5|string|unique:books_data,BOOK_ID',
            'book_title'=> 'required|max:255|string',
            'book_year' => 'required|digits:4|min:1901|integer|max:' . date('Y'),
            'book_publisher' => 'required|max:255|string',
            'book_copies' => 'required|integer|min:0',
            'author_id' => 'required|exists:author_data,AUTHOR_ID',
            'genre_id' => 'required|exists:genre_data,GENRE_ID',
        ]);

        // Create new book
        $book = Books::create([
            'BOOK_ID' => $validated['book_id'],
            'BOOK_TITLE' => $validated['book_title'],
            'BOOK_YEAR' => $validated['book_year'],
            'BOOK_PUBLISHER' => $validated['book_publisher'],
            'BOOK_COPIES' => $validated['book_copies'],
        ]);

        $book->authors()->attach($validated['author_id']);
        $book->genres()->attach($validated['genre_id']);

        return redirect()->route('booksdatabase.index')->with('success', 'Book added successfully!');

    }

    public function update(Request $request, $id) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'book_title'=> 'required|max:255|string',
            'book_year' => 'required|digits:4|min:1901|integer|max:' . date('Y'),
            'book_publisher' => 'required|max:255|string',
            'book_copies' => 'required|integer|min:0',
            'author_id' => 'required|exists:author_data,AUTHOR_ID',
            'genre_id' => 'required|exists:genre_data,GENRE_ID',
        ]);

        // Find the book by ID and update its details
        $book = Books::where('BOOK_ID', $id)->firstOrFail();
        $book->update([
            'BOOK_TITLE' => $validated['book_title'],
            'BOOK_YEAR' => $validated['book_year'],
            'BOOK_PUBLISHER' => $validated['book_publisher'],
            'BOOK_COPIES' => $validated['book_copies'],
        ]);

        $book->authors()->sync([$validated['author_id']]);
        $book->genres()->sync([$validated['genre_id']]);

        return redirect()->route('booksdatabase.index')->with('success', 'Book updated successfully!');
    }
    public function destroy($id) {
        // Find the book by ID and delete it
        $book = Books::where('BOOK_ID', $id)->firstOrFail();

        $book->authors()->detach();
        $book->genres()->detach();

        $book->delete();

        return redirect()->route('booksdatabase.index')->with('success', 'Book deleted successfully!');
    }
}