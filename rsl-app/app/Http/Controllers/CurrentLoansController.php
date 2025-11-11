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
}