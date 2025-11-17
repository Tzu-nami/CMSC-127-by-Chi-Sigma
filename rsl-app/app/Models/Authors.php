<?php

namespace App\Models;
use App\Models\Books;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

        public function books(): BelongsToMany
    {
        return $this->belongsToMany(
            Books::class,
            'book_authors',
            'author_id', 
            'book_id',  
            'AUTHOR_ID', 
            'BOOK_ID'    
        );
    }
}