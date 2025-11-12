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
    Route::post('/booksdatabase',[BooksDatabaseController::class,'store'])->name('booksdatabase.store');
    Route::post('/borrowersdatabase',[BorrowersDatabaseController::class,'store'])->name('borrowersdatabase.store');
    Route::post('/staffdatabase',[StaffDatabaseController::class,'store'])->name('staffdatabase.store');
    Route::post('/authorsdatabase',[AuthorsDatabaseController::class,'store'])->name('authorsdatabase.store');
    Route::post('/currentloans',[CurrentLoansController::class,'store'])->name('currentloans.store');
    Route::put('/booksdatabase/{book}',[BooksDatabaseController::class,'update'])->name('booksdatabase.update');
    Route::put('/borrowersdatabase/{borrower}',[BorrowersDatabaseController::class,'update'])->name('borrowersdatabase.update');
    Route::put('/staffdatabase/{staff}',[StaffDatabaseController::class,'update'])->name('staffdatabase.update');
    Route::put('/authorsdatabase/{author}',[AuthorsDatabaseController::class,'update'])->name('authorsdatabase.update');
    Route::put('/currentloans/{currentloan}',[CurrentLoansController::class,'update'])->name('currentloans.update');
    Route::delete('/booksdatabase/{book}',[BooksDatabaseController::class,'destroy'])->name('booksdatabase.destroy');
    Route::delete('/borrowersdatabase/{borrower}',[BorrowersDatabaseController::class,'destroy'])->name('borrowersdatabase.destroy');
    Route::delete('/staffdatabase/{staff}',[StaffDatabaseController::class,'destroy'])->name('staffdatabase.destroy');
    Route::delete('/authorsdatabase/{author}',[AuthorsDatabaseController::class,'destroy'])->name('authorsdatabase.destroy');
});

require __DIR__.'/settings.php';
