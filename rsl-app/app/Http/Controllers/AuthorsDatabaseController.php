<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Authors;

class AuthorsDatabaseController extends Controller
{
    public function index(Request $request) {
        
        $query = Authors::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('AUTHOR_ID', 'like', "%{$search}%")
                ->orWhere('AUTHOR_LASTNAME', 'like', "%{$search}%")
                ->orWhere('AUTHOR_FIRSTNAME', 'like', "%{$search}%")
                ->orWhere('AUTHOR_MIDDLEINITIAL', 'like', "%{$search}%");

        }); 
        
        $author =$query->get();
        return Inertia::render('AuthorsDatabase/authors-index', [
            'authors' => $author,

            'filters'=>$request->only(['search']),
        ]);
    }
}
