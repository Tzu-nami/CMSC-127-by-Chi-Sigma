<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Staff;

class StaffDatabaseController extends Controller
{
    public function index(Request $request) {

        $query = Staff::query();

        $query->when($request->input('search'), function ($query, $search) {
            $query->where('STAFF_ID', 'like', "%{$search}%")
                ->orWhere('STAFF_LASTNAME', 'like', "%{$search}%")
                ->orWhere('STAFF_FIRSTNAME', 'like', "%{$search}%")
                ->orWhere('STAFF_MIDDLEINITIAL', 'like', "%{$search}%")
                ->orWhere('STAFF_JOB', 'like', "%{$search}%");

        }); 
        
        $staff =$query->get();

        return Inertia::render('StaffDatabase/staff-index', [
            'staff' => $staff,

            'filters'=>$request->only(['search']),
        ]);
    }

    public function store(Request $request) {
        // Check if all inputs are valid
        $validated = $request->validate([
            'staff_id' => 'required|max:5|string|unique:staff_data,STAFF_ID',
            'staff_lastname'=> 'required|max:255|string',
            'staff_firstname' => 'required|max:255|string',
            'staff_middleinitial' => 'nullable|max:2|string',
            'staff_job' => 'required|max:100|string',
        ]);

        // Create new staff
        Staff::create([
            'STAFF_ID' => $validated['staff_id'],
            'STAFF_LASTNAME' => $validated['staff_lastname'],
            'STAFF_FIRSTNAME' => $validated['staff_firstname'],
            'STAFF_MIDDLEINITIAL' => $validated['staff_middleinitial'],
            'STAFF_JOB' => $validated['staff_job'],
        ]);

        return redirect()->route('staffdatabase.index')->with('success', 'Staff added successfully!');
    }
}
