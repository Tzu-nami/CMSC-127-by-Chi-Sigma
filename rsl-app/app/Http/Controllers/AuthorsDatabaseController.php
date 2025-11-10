<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Authors;

class AuthorsDatabaseController extends Controller
{
    public function index() {
        // Fetch all authors from the database and store it
        return Inertia::render('AuthorsDatabase/authors-index', [
            'authors' => Authors::all(),
        ]);
    }
}
