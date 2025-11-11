<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Authors extends Model
{
    use HasFactory;

    //Retrieve data from borrower_data table
    protected $table = 'author_data';
    protected $primaryKey = 'AUTHOR_ID';
    protected $keyType = 'string';
    public $timestamps = false; // REALLY REALLY IMPORTANT TO ADD THIS LINE

    //Choose which ones to display
    protected $fillable = [
        'AUTHOR_ID',
        'AUTHOR_LASTNAME',
        'AUTHOR_FIRSTNAME',
        'AUTHOR_MIDDLEINITIAL',
    ];
}