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
                'books' => [],
                'borrowers' => [],
                'transactions' => [],
                'authors' => [],
                'staff' => [],
                'genres' => [],
                'allBooks' => [],
                'booksByAuthor' => [],
            ]);
        }

        // search in books table
        $books = DB::table('books_data')
            ->where('BOOK_TITLE', 'LIKE', '%' . $query . '%')
            ->orWhere('BOOK_YEAR', 'LIKE', '%' . $query . '%')
            ->orWhere('BOOK_PUBLISHER', 'LIKE', '%' . $query . '%')
            ->orWhere('BOOK_COPIES', 'LIKE', '%' . $query . '%')
            ->orWhere('BOOK_ID', 'LIKE', '%' . $query . '%')
            ->get();

        // search in authors table
        $authors = DB::table('author_data')
            ->where('AUTHOR_LASTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('AUTHOR_FIRSTNAME', 'LIKE', '%' . $query . '%')
            ->orWhere('AUTHOR_MIDDLEINITIAL', 'LIKE', '%' . $query . '%')
            ->orWhere('AUTHOR_ID', 'LIKE', '%' . $query . '%')
            ->get();

        $booksByAuthor = collect();
        // get books written by the found authors
        if ($authors->count() > 0) {
            $authorIDs = $authors->pluck('AUTHOR_ID')->toArray();
            // find the matching book ids in the book_authors 
            $bookIDs = DB::table('book_authors')
                ->whereIn('AUTHOR_ID', $authorIDs)
                ->pluck('BOOK_ID')
                ->toArray();

            if(!empty($bookIDs)) {
                // fetch the book details using those IDs
                $booksByAuthor = DB::table('books_data')
                    ->whereIn('BOOK_ID', $bookIDs)
                    ->get();
            }
        }

        $allBooks = collect($books)
            ->merge($booksByAuthor)
            ->unique('BOOK_ID')
            ->values();

        $allBooks = collect($books)->merge($booksByAuthor)->unique('BOOK_ID')->values();

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

        // search in genres table
        $genres = DB::table('genre_data')
            ->where('GENRE_NAME', 'LIKE', '%' . $query . '%')
            ->orWhere('GENRE_LOCATION', 'LIKE', '%' . $query . '%')
            ->orWhere('GENRE_ID', 'LIKE', '%' . $query . '%')
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
            'authors' => $authors,
            'allBooks' => $allBooks,
            'booksByAuthor' => $booksByAuthor,
            'staff' => $staff,
            'borrowers' => $borrowers,
            'transactions' => $transactions,
            'genres' => $genres,
        ]);
    }
}
