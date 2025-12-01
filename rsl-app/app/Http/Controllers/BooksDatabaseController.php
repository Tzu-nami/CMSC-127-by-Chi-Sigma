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

        // select all columns from the main books table
        $query->select("{$booksTable}.*");

        // fetch author names
        $query->addSelect([
            'author_names' => DB::table('book_authors')
                ->join('author_data', 'book_authors.AUTHOR_ID', '=', 'author_data.AUTHOR_ID')
                ->whereColumn('book_authors.BOOK_ID', "{$booksTable}.BOOK_ID")
                ->select(DB::raw("GROUP_CONCAT(CONCAT(author_data.AUTHOR_FIRSTNAME, ' ', author_data.AUTHOR_LASTNAME) SEPARATOR ', ')"))
                ->limit(1)
        ]);

        // fetch genre names
        $query->addSelect([
            'genre_names' => DB::table('book_genre')
                ->join('genre_data', 'book_genre.GENRE_ID', '=', 'genre_data.GENRE_ID')
                ->whereColumn('book_genre.BOOK_ID', "{$booksTable}.BOOK_ID")
                ->select(DB::raw("GROUP_CONCAT(genre_data.GENRE_NAME SEPARATOR ', ')"))
                ->limit(1)
        ]);

        $query->with([
            'authors:AUTHOR_ID,AUTHOR_FIRSTNAME,AUTHOR_MIDDLEINITIAL,AUTHOR_LASTNAME',
            'genres:GENRE_ID,GENRE_NAME,GENRE_LOCATION',
        ]);

        $query->withCount('currentLoans');

        // search
        $query->when($request->input('search'), function ($query, $search) use ($booksTable) {
            $query->where(function($q) use ($search, $booksTable) {
                $q->where("{$booksTable}.BOOK_TITLE", 'like', "%{$search}%")
                    ->orWhere("{$booksTable}.BOOK_PUBLISHER", 'like', "%{$search}%")
                    ->orWhere("{$booksTable}.BOOK_ID", 'like', "%{$search}%")
                    ->orWhere("{$booksTable}.BOOK_YEAR", 'like', "%{$search}%")
                    ->orWhereHas('authors', function ($authorQuery) use ($search) {
                        $authorQuery->where('AUTHOR_FIRSTNAME', 'like', "%{$search}%")
                                    ->orWhere('AUTHOR_LASTNAME', 'like', "%{$search}%");
                    })
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

            'create_new_author' => 'required|string',
            'create_new_genre' =>  'required|string',
        ]);

        $createNewAuthor = $request->create_new_author === 'true';
        $createNewGenre = $request->create_new_genre === 'true';

        return DB::transaction(function () use ($request, $createNewAuthor, $createNewGenre, $validated) {
            if ($createNewAuthor) {
                $request->validate([
                    'new_author_id'  => 'required|integer|max:999999|unique:author_data,AUTHOR_ID',
                    'new_author_firstname' => 'required|string|max:255',
                    'new_author_lastname' => 'required|string|max:255',
                    'new_author_middleinitial' => 'nullable|string|max:2',
                ]);

                Authors::create([
                    'AUTHOR_ID' => $request->new_author_id,
                    'AUTHOR_FIRSTNAME' => $request->new_author_firstname,
                    'AUTHOR_LASTNAME' => $request->new_author_lastname,
                    'AUTHOR_MIDDLEINITIAL' => $request->new_author_middleinitial,
                ]);

                $authorId = $request->new_author_id;
            } else {
                $request->validate([
                    'author_id' => 'required|exists:author_data,AUTHOR_ID',
                ]);
                $authorId = $request->author_id;
            }

            if ($createNewGenre) {
                $request->validate([
                    'new_genre_id' => 'required|integer|min:7052000|max:9999999|unique:genre_data,GENRE_ID',
                    'new_genre_name' => 'required|string|max:255',
                    'new_genre_location' => 'nullable|string|max:255',
                ]);

                Genres::create([
                    'GENRE_ID' => $request->new_genre_id,
                    'GENRE_NAME' => $request->new_genre_name,
                    'GENRE_LOCATION' => $request->new_genre_location,
                ]);

                $genreId = $request->new_genre_id;
            } else {
                $request->validate([
                    'genre_id' => 'required|exists:genre_data,GENRE_ID',
                ]);
                $genreId = $request->genre_id;
        }

        // Create new book
        $book = Books::create([
            'BOOK_ID' => $validated['book_id'],
            'BOOK_TITLE' => $validated['book_title'],
            'BOOK_YEAR' => $validated['book_year'],
            'BOOK_PUBLISHER' => $validated['book_publisher'],
            'BOOK_COPIES' => $validated['book_copies'],
        ]);

        $book->authors()->attach($authorId);
        $book->genres()->attach($genreId);

        return redirect()->route('booksdatabase.index')->with('success', 'Book added successfully!');
        });
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