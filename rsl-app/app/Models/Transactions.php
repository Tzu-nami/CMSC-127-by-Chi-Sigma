<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;

    //Retrieve data from transactions_data table
    protected $table = 'transaction_data';
    protected $primaryKey = 'TRANSACTION_ID';
    protected $keyType = 'string';
    public $timestamps = false; // REALLY REALLY IMPORTANT TO ADD THIS LINE

    //Choose which ones to display
    protected $fillable = [
        'TRANSACTION_ID',
        'TRANSACTION_BORROWDATE',
        'TRANSACTION_DUEDATE'
    ];
}