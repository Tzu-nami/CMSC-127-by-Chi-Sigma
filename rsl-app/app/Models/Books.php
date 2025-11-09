<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Books extends Model
{
    use HasFactory;

    //Retrieve data from books_data table
    protected $table = 'books_data';

    //Choose which ones to display
    protected $fillable = [
        'BOOK_ID',
        'BOOK_TITLE',
        'BOOK_YEAR',
        'BOOK_PUBLISHER',
        'BOOK_COPIES',
    ];
}
