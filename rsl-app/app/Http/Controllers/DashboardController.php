<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Books;
use App\Models\Borrowers;
use App\Models\Staff;
use App\Models\Authors;
use App\Models\Genres;
class DashboardController extends Controller
{
    public function index()
    {
        // stats
        $totalBooks = DB::table('books_data')->count();
        $activeLoans = DB::table('current_loan')->count();
        $availableCopies = DB::table('books_data')->sum('BOOK_COPIES');
        $totalBorrowers = DB::table('borrower_data')->count();

        // last 8 transactions (YUN LANG KASYA)
        $recentTransactions = DB::table('transaction_data as t')
            // join current loan
            ->join('current_loan as cl', 't.TRANSACTION_ID', '=', 'cl.TRANSACTION_ID')
            // join books data using BOOK_ID from current_loan
            ->join('books_data as b', 'cl.BOOK_ID', '=', 'b.BOOK_ID')
            // join borrower data using BORROWER_ID from current_loan
            ->join('borrower_data as bor', 'cl.BORROWER_ID', '=', 'bor.BORROWER_ID')
            ->select(
                't.TRANSACTION_ID',
                't.TRANSACTION_BORROWDATE',
                't.TRANSACTION_DUEDATE',
                'b.BOOK_TITLE',
                'bor.BORROWER_FIRSTNAME',
                'bor.BORROWER_LASTNAME'
            )
            ->orderBy('t.TRANSACTION_BORROWDATE', 'desc') // kasi recent
            ->limit(7)
            ->get();
        
        $books = Books::all();
        $borrowers = Borrowers::all();
        $staff = Staff::all();
        $authors = Authors::all();
        $genres = Genres::all();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBooks' => $totalBooks,
                'activeLoans' => $activeLoans,
                'availableCopies' => $availableCopies,
                'totalBorrowers' => $totalBorrowers,
            ],
            'recentTransactions' => $recentTransactions,
            'books' => $books,
            'borrowers' => $borrowers,
            'staff' => $staff,
            'authors' => $authors,
            'genres' => $genres,
        ]);
    }

    // search function
    public function search()
    {
        $query = request('q', '');

        if (strlen($query) < 2) {
            return Inertia::render('search-results', [
                'query' => $query,
                'books' => [], 'authors' => [], 'staff' => [], 'borrowers' => [],
                'transactions' => [], 'genres' => [], 'allBooks' => [], 
                'booksByAuthor' => [], 'booksByGenre' => []
            ]);
        }

        // base query
        $baseBookQuery = DB::table('books_data')
        // fetch authors and genres
            ->select('books_data.*')
            ->addSelect([
                'author_names' => DB::table('book_authors')
                    ->join('author_data', 'book_authors.AUTHOR_ID', '=', 'author_data.AUTHOR_ID')
                    ->whereColumn('book_authors.BOOK_ID', 'books_data.BOOK_ID')
                    ->select(DB::raw("GROUP_CONCAT(CONCAT(author_data.AUTHOR_FIRSTNAME, ' ', author_data.AUTHOR_LASTNAME) SEPARATOR ', ')"))
                    ->limit(1)
            ])
            ->addSelect([
                'genre_names' => DB::table('book_genre')
                    ->join('genre_data', 'book_genre.GENRE_ID', '=', 'genre_data.GENRE_ID')
                    ->whereColumn('book_genre.BOOK_ID', 'books_data.BOOK_ID')
                    ->select(DB::raw("GROUP_CONCAT(genre_data.GENRE_NAME SEPARATOR ', ')"))
                    ->limit(1)
            ]);


        // search in authors table
        $authors = DB::table('author_data')
            ->where('AUTHOR_LASTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('AUTHOR_FIRSTNAME', 'LIKE', '%' . $query . '%')
            ->get();

        // loop through each author and attach their specific books
        foreach ($authors as $author) {
            $bookIds = DB::table('book_authors')
                ->where('AUTHOR_ID', $author->AUTHOR_ID)
                ->pluck('BOOK_ID')
                ->toArray();
            
            $author->books = [];
            
            if (!empty($bookIds)) {
                $author->books = $baseBookQuery->clone()
                    ->whereIn('books_data.BOOK_ID', $bookIds)
                    ->get();
            }
        }

        // search in genres table
        $genres = DB::table('genre_data')
            ->where('GENRE_NAME', 'LIKE', '%' . $query . '%')
            ->get();

        // loop through each genre and attach their specific books
        foreach ($genres as $genre) {
            $bookIds = DB::table('book_genre') 
                ->where('GENRE_ID', $genre->GENRE_ID)
                ->pluck('BOOK_ID')
                ->toArray();

            $genre->books = [];

            if (!empty($bookIds)) {
                $genre->books = $baseBookQuery->clone()
                    ->whereIn('books_data.BOOK_ID', $bookIds)
                    ->get();
            }
        }

        // title search
        $books = $baseBookQuery->clone()
            ->where(function($q) use ($query) {
                $q->where('BOOK_TITLE', 'LIKE', '%' . $query . '%')
                  ->orWhere('BOOK_YEAR', 'LIKE', '%' . $query . '%')
                  ->orWhere('BOOK_PUBLISHER', 'LIKE', '%' . $query . '%')
                  ->orWhere('BOOK_COPIES', 'LIKE', '%' . $query . '%')
                  ->orWhere('BOOK_ID', 'LIKE', '%' . $query . '%');
            })
            ->get();

        // search in staff table
        $staff = DB::table('staff_data')
            ->where('STAFF_LASTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('STAFF_FIRSTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('STAFF_MIDDLEINITIAL', 'LIKE', '%' . $query . '%')
            ->orWhere('STAFF_ID', 'LIKE', '%' . $query . '%')
            ->get();

        // search in borrowers table
        $borrowers = DB::table('borrower_data')
            ->where('BORROWER_LASTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('BORROWER_FIRSTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('BORROWER_MIDDLEINITIAL', 'LIKE', '%' . $query . '%')
            ->orWhere('BORROWER_STATUS', 'LIKE', '%' . $query . '%')
            ->orWhere('BORROWER_CONTACTNUMBER', 'LIKE', '%' . $query . '%')
            ->orWhere('BORROWER_ID', 'LIKE', '%' . $query . '%')
            ->get();

        // search in transactions table
        $transactions = DB::table('transaction_data')
            ->where('TRANSACTION_ID', 'LIKE', '%' . $query . '%')
            ->orWhere('TRANSACTION_BORROWDATE', 'LIKE', '%' . $query . '%')
            ->orWhere('TRANSACTION_DUEDATE', 'LIKE', '%' . $query . '%')
            ->get();

        return Inertia::render('search-results', [
            'query' => $query,
            'books' => $books,
            'allBooks' => $books,
            'authors' => $authors,
            'genres' => $genres,
            'staff' => $staff,
            'borrowers' => $borrowers,
            'transactions' => $transactions,
            'booksByAuthor' => [], 
            'booksByGenre' => [],
        ]);
    }
}
