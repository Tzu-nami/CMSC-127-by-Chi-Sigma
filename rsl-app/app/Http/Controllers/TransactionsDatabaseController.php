<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transactions;

class TransactionsDatabaseController extends Controller
{
    public function index(Request $request) {

        $query = Transactions::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('TRANSACTION_ID', 'like', "%{$search}%")
                ->orWhere('TRANSACTION_BORROWDATE', 'like', "%{$search}%")
                ->orWhere('TRANSACTION_DUEDATE', 'like', "%{$search}%");
        }); 
        
        $transactions =$query->get();

        return Inertia::render('TransactionsDatabase/transactions-index', [
            'transactions' => $transactions,

            'filters'=>$request->only(['search']),
        ]);
    }

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'transaction_id' => 'required|max:5|string|unique:transaction_data,TRANSACTION_ID',
            'transaction_borrowdate'=> 'required|date_format:m/d/Y',
            'transaction_duedate' => 'required|date_format:m/d/Y|after_or_equal:today'
        ]);

        // Create new current loan
        Transactions::create([
            'TRANSACTION_ID' => $validated['transaction_id'],
            'TRANSACTION_BORROWDATE' => $validated['transaction_borrowdate'],
            'TRANSACTION_DUEDATE' => $validated['transaction_duedate'],
        ]);

        return redirect()->route('transactionsdatabase.index')->with('success', 'Transaction added successfully!');
    }
    public function update(Request $request, $id) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'transaction_id'=> 'required|max:5|string',
            'transaction_borrowdate' => 'required|date_format:m/d/Y',
            'transaction_duedate' => 'required|date_format:m/d/Y|after_or_equal:today'
        ]);

        // Update transactions
        $transactions = Transactions::where('TRANSACTION_ID', $id)->firstOrFail();
        $transactions->update([
            'TRANSACTION_ID' => $validated['transaction_id'],
            'TRANSACTION_BORROWDATE' => $validated['transaction_borrowdate'],
            'TRANSACTION_DUEDATE' => $validated['transaction_duedate'],
        ]);

        return redirect()->route('transactionsdatabase.index')->with('success', 'Transaction updated successfully!');
    }
}