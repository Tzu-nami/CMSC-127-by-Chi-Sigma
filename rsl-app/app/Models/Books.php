<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    use HasFactory;

    //Retrieve data from books_data table
    protected $table = 'books_data';
    protected $primaryKey = 'BOOK_ID';
    protected $keyType = 'string';
    public $timestamps = false; // REALLY REALLY IMPORTANT TO ADD THIS LINE

    //Choose which ones to display
    protected $fillable = [
        'BOOK_ID',
        'BOOK_TITLE',
        'BOOK_YEAR',
        'BOOK_PUBLISHER',
        'BOOK_COPIES',
    ];
}
