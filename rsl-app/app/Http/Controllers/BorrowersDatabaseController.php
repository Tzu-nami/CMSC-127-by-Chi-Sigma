<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Borrowers;

class BorrowersDatabaseController extends Controller
{
    public function index() {
        // Fetch all borrowers from the database and store it
        $borrowers = Borrowers::all();

        return Inertia::render('BorrowersDatabase/borrowers-index', [
            'borrowers' => $borrowers,
        ]);
    }
}
