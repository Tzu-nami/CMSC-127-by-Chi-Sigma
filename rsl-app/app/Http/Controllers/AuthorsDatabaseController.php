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

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'author_id' => 'required|min:16000|max:99999|integer|unique:author_data,AUTHOR_ID',
            'author_lastname'=> 'required|max:255|string',
            'author_firstname' => 'required|max:255|string',
            'author_middleinitial' => 'nullable|max:2|string',
        ]);

        // Create new author
        Authors::create([
            'AUTHOR_ID' => $validated['author_id'],
            'AUTHOR_LASTNAME' => $validated['author_lastname'],
            'AUTHOR_FIRSTNAME' => $validated['author_firstname'],
            'AUTHOR_MIDDLEINITIAL' => $validated['author_middleinitial'],
        ]);

        return redirect()->route('authorsdatabase.index')->with('success', 'Author added successfully!');

    }
}
