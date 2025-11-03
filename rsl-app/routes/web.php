<?php

use App\Http\Controllers\BooksDatabaseController;
use App\Http\Controllers\AuthorsDatabaseController;
use App\Http\Controllers\BorrowersDatabaseController;
use App\Http\Controllers\CurrentLoansController;
use App\Http\Controllers\StaffDatabaseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/booksdatabase',[BooksDatabaseController::class,'index'])->name('booksdatabase.index');
    Route::get('/authorsdatabase',[AuthorsDatabaseController::class,'index'])->name('authorsdatabase.index');
    Route::get('/borrowersdatabase',[BorrowersDatabaseController::class,'index'])->name('borrowersdatabase.index');
    Route::get('/currentloans',[CurrentLoansController::class,'index'])->name('currentloans.index');
    Route::get('/staffdatabase',[StaffDatabaseController::class,'index'])->name('staffdatabase.index');
});

require __DIR__.'/settings.php';
