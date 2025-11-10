<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Staff;

class StaffDatabaseController extends Controller
{
    public function index() {
        // Fetch all staff from the database and store it
        $staff = Staff::all();

        return Inertia::render('StaffDatabase/staff-index', [
            'staff' => $staff,
        ]);
    }
}
