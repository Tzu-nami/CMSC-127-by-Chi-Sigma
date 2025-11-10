<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    //Retrieve data from borrower_data table
    protected $table = 'staff_data';

    //Choose which ones to display
    protected $fillable = [
        'STAFF_ID',
        'STAFF_LASTNAME',
        'STAFF_FIRSTNAME',
        'STAFF_MIDDLEINITIAL',
        'STAFF_JOB',
    ];
}