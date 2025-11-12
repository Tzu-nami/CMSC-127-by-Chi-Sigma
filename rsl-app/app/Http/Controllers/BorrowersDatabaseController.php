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

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'borrower_id' => 'required|max:5|string|unique:borrower_data,BORROWER_ID',
            'borrower_lastname'=> 'required|max:255|string',
            'borrower_firstname' => 'required|max:255|string',
            'borrower_middleinitial' => 'nullable|max:2|string',
            'borrower_status' => 'required|max:50|string',
            'borrower_contactnumber' => 'required|max:15|string|unique:borrower_data,BORROWER_CONTACTNUMBER'
        ]);

        // Create new borrower
        Borrowers::create([
            'BORROWER_ID' => $validated['borrower_id'],
            'BORROWER_LASTNAME' => $validated['borrower_lastname'],
            'BORROWER_FIRSTNAME' => $validated['borrower_firstname'],
            'BORROWER_MIDDLEINITIAL' => $validated['borrower_middleinitial'],
            'BORROWER_STATUS' => $validated['borrower_status'],
            'BORROWER_CONTACTNUMBER' => $validated['borrower_contactnumber'],
        ]);

        return redirect()->route('borrowersdatabase.index')->with('success', 'Borrower added successfully!');
    }
    public function update(Request $request, $id) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'borrower_lastname'=> 'required|max:255|string',
            'borrower_firstname' => 'required|max:255|string',
            'borrower_middleinitial' => 'nullable|max:2|string',
            'borrower_status' => 'required|max:50|string',
            'borrower_contactnumber' => 'required|max:15|string'
        ]);

        // Find the borrower by ID and update its details
        $borrower = Borrowers::where('BORROWER_ID', $id)->firstOrFail();
        $borrower->update([
            'BORROWER_LASTNAME' => $validated['borrower_lastname'],
            'BORROWER_FIRSTNAME' => $validated['borrower_firstname'],
            'BORROWER_MIDDLEINITIAL' => $validated['borrower_middleinitial'],
            'BORROWER_STATUS' => $validated['borrower_status'],
            'BORROWER_CONTACTNUMBER' => $validated['borrower_contactnumber'],
        ]);

        return redirect()->route('borrowersdatabase.index')->with('success', 'Borrower updated successfully!');
    }
    public function destroy($id) {
        // Find the borrower by ID and delete
        $borrower = Borrowers::where('BORROWER_ID', $id)->firstOrFail();
        $borrower->delete();

        return redirect()->route('borrowersdatabase.index')->with('success', 'Borrower deleted successfully!');
    }
}
