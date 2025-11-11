<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurrentLoans extends Model
{
    use HasFactory;

    //Retrieve data from borrower_data table
    protected $table = 'current_loan';
    protected $primaryKey = 'TRANSACTION_ID';
    protected $keyType = 'string';
    public $timestamps = false; // REALLY REALLY IMPORTANT TO ADD THIS LINE


    //Choose which ones to display
    protected $fillable = [
        'TRANSACTION_ID',
        'BOOK_ID',
        'BORROWER_ID',
        'STAFF_ID',
    ];
}