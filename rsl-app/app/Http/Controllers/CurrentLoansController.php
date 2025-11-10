<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\CurrentLoans;

class CurrentLoansController extends Controller
{
    public function index() {
        return Inertia::render('CurrentLoans/currentloans-index', [
            'currentLoans' => CurrentLoans::all(),
        ]);
    }
}