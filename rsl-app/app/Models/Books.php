<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Books extends Model
{
    use HasFactory;

    //Retrieve data from books_data table
    protected $table = 'books_data';
    protected $primaryKey = 'BOOK_ID';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false; // REALLY REALLY IMPORTANT TO ADD THIS LINE

    //Choose which ones to display
    protected $fillable = [
        'BOOK_ID',
        'BOOK_TITLE',
        'BOOK_YEAR',
        'BOOK_PUBLISHER',
        'BOOK_COPIES',
    ];

    protected $appends = ['author_names', 'genre_names'];

    public function authors(): BelongsToMany
    {

        return $this->belongsToMany(
            Authors::class, 
            'book_authors',
            'BOOK_ID',   
            'AUTHOR_ID',
            'BOOK_ID',   
            'AUTHOR_ID' );
    }

    public function genres(): BelongsToMany
    {

        return $this->belongsToMany(
            Genres::class, 
            'book_genre', 
            'BOOK_ID',
            'GENRE_ID',  
            'BOOK_ID',
            'GENRE_ID'
        );
    }

    public function currentLoans()
        {
            return $this->hasMany('App\Models\CurrentLoans', 'book_id', 'BOOK_ID');
        }
    
    public function getAuthorNamesAttribute(): string
        {
        // create a full name
        return $this->authors->map(function ($author) {
            return trim($author->AUTHOR_FIRSTNAME . ' ' . $author->AUTHOR_MIDDLEINITIAL. ' ' . $author->AUTHOR_LASTNAME);
        })->implode(', ');
        }

    public function getGenreNamesAttribute(): string
        {            
            return $this->genres->pluck('GENRE_NAME')->implode(', ');
        }
}
