<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrentLoansDatabaseController extends Controller
{
    public function index() {
        return Inertia::render('CurrentLoans/currentloans-index', []);
    }
}
