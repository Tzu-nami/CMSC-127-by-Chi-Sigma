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
}
