<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Borrowers;

class BorrowersDatabaseController extends Controller
{
    public function index(Request $request) {
        $query = Borrowers::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('BORROWER_ID', 'like', "%{$search}%")
                ->orWhere('BORROWER_LASTNAME', 'like', "%{$search}%")
                ->orWhere('BORROWER_FIRSTNAME', 'like', "%{$search}%")
                ->orWhere('BORROWER_MIDDLEINITIAL', 'like', "%{$search}%")
                ->orWhere('BORROWER_STATUS', 'like', "%{$search}%")
                ->orWhere('BORROWER_CONTACTNUMBER', 'like', "%{$search}%");
            });
            
            $borrowers = $query->get();
            return Inertia::render('BorrowersDatabase/borrowers-index', [
                'borrowers' => $borrowers,
    
                'filters'=>$request->only(['search']),
            ]);
    }
}
