<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\CurrentLoans;

class CurrentLoansController extends Controller
{
    public function index(Request $request) {
        
        $query = CurrentLoans::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('TRANSACTION_ID', 'like', "%{$search}%")
                ->orWhere('BORROWER_ID', 'like', "%{$search}%")
                ->orWhere('STAFF_ID', 'like', "%{$search}%")
                ->orWhere('BOOK_ID', 'like', "%{$search}%");

        }); 
        
        $currentLoans =$query->get();
        return Inertia::render('CurrentLoans/currentloans-index', [
            'currentLoans' => $currentLoans,

            'filters'=>$request->only(['search']),
        ]);
    }

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'transaction_id' => 'required|max:5|string|unique:current_loan,TRANSACTION_ID',
            'book_id'=> 'required|max:5|string|unique:current_loan,BOOK_ID',
            'borrower_id' => 'required|max:5|string|unique:current_loan,BORROWER_ID',
            'staff_id' => 'required|max:5|string|unique:current_loan,STAFF_ID',
        ]);

        // Create new current loan
        CurrentLoans::create([
            'TRANSACTION_ID' => $validated['transaction_id'],
            'BOOK_ID' => $validated['book_id'],
            'BORROWER_ID' => $validated['borrower_id'],
            'STAFF_ID' => $validated['staff_id'],
        ]);

        return redirect()->route('currentloans.index')->with('success', 'Current Loan added successfully!');

    }
}