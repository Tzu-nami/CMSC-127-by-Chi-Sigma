<?php

namespace App\Models;
use App\Models\Books;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Genres extends Model
{
    use HasFactory;

    protected $table = 'genre_data';

    protected $primaryKey = 'GENRE_ID';

    public $timestamps = false;

    public function books(): BelongsToMany
    {

        return $this->belongsToMany(
            Books::class,
            'book_genre',
            'genre_id', 
            'book_id',  
            'GENRE_ID',
            'BOOK_ID'   
        );
    }
}