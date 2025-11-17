<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\CurrentLoans;
use App\Models\Transactions;
use App\Models\Books;
use App\Models\Borrowers;
use App\Models\Staff;
use Carbon\Carbon;

class CurrentLoansController extends Controller
{
    public function index(Request $request) {
        
        $query = CurrentLoans::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('TRANSACTION_ID', 'like', "%{$search}%")
                ->orWhere('TRANSACTION_BORROWDATE', 'like', "%{$search}%")
                ->orWhere('BORROWER_ID', 'like', "%{$search}%")
                ->orWhere('STAFF_ID', 'like', "%{$search}%")
                ->orWhere('BOOK_ID', 'like', "%{$search}%");

        }); 
        $currentLoans =$query->get();

        $books = Books::all();
        $borrowers = Borrowers::all();
        $staff = Staff::all();

        return Inertia::render('CurrentLoans/currentloans-index', [
            'currentLoans' => $currentLoans,
            'books' => $books,
            'borrowers' => $borrowers,
            'staff' => $staff,

            'filters'=>$request->only(['search']),
        ]);
    }

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'transaction_id' => 'required|max:5|string|unique:current_loan,TRANSACTION_ID',
            'transaction_borrowdate' => 'required|date_format:Y-m-d',
            'book_id'=> 'required|max:5|string',
            'borrower_id' => 'required|max:5|string',
            'staff_id' => 'required|max:5|string',
        ]);

        $borrowDate = Carbon::createFromFormat('Y-m-d', $validated['transaction_borrowdate']);
        $dueDate = $borrowDate->copy()->addDays(7);

        Transactions::create([
            'TRANSACTION_ID' => $validated['transaction_id'],
            'TRANSACTION_BORROWDATE' => $borrowDate->format('Y-m-d'),
            'TRANSACTION_DUEDATE' => $dueDate->format('Y-m-d'),
        ]);

        // Create new current loan
        CurrentLoans::create([
            'TRANSACTION_ID' => $validated['transaction_id'],
            'TRANSACTION_BORROWDATE' => $borrowDate->format('Y-m-d'),
            'TRANSACTION_DUEDATE' => $dueDate->format('Y-m-d'),
            'BOOK_ID' => $validated['book_id'],
            'BORROWER_ID' => $validated['borrower_id'],
            'STAFF_ID' => $validated['staff_id'],
        ]);

        return redirect()->route('currentloans.index')->with('success', 'Current Loan added successfully!');
    }
    public function update(Request $request, $id) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'transaction_borrowdate' => 'required|date_format:Y-m-d', 
            'book_id'=> 'required|max:5|string',
            'borrower_id' => 'required|max:5|string',
            'staff_id' => 'required|max:5|string',
        ]);

        $borrowDate = Carbon::createFromFormat('Y-m-d', $validated['transaction_borrowdate']);
        $dueDate = $borrowDate->copy()->addDays(7);

        $transaction = Transactions::where('TRANSACTION_ID', $id)->first();
        if ($transaction) {
            $transaction->update([
                'TRANSACTION_BORROWDATE' => $borrowDate -> format('Y-m-d'),
                'TRANSACTION_DUEDATE' => $dueDate -> format('Y-m-d'),
            ]);
        }

        // Update current loan
        $currentLoan = CurrentLoans::where('TRANSACTION_ID', $id)->firstOrFail();
        $currentLoan->update([
            'TRANSACTION_BORROWDATE' => $borrowDate -> format('Y-m-d'),
            'TRANSACTION_DUEDATE' => $dueDate->format('Y-m-d'),
            'BOOK_ID' => $validated['book_id'],
            'BORROWER_ID' => $validated['borrower_id'],
            'STAFF_ID' => $validated['staff_id'],
        ]);

        return redirect()->route('currentloans.index')->with('success', 'Current Loan updated successfully!');
    }
}