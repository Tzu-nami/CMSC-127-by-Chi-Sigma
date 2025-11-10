<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowers extends Model
{
    use HasFactory;

    //Retrieve data from borrower_data table
    protected $table = 'borrower_data';

    //Choose which ones to display
    protected $fillable = [
        'BORROWER_ID',
        'BORROWER_LASTNAME',
        'BORROWER_FIRSTNAME',
        'BORROWER_MIDDLEINITIAL',
        'BORROWER_STATUS',
        'BORROWER_CONTACTNUMBER',
    ];
}