<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'BOOKS_DATA';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'BOOK_ID';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    public function currentLoans()
        {
            
            return $this->hasMany('App\Models\CurrentLoan', 'book_id', 'BOOK_ID');
        }
}