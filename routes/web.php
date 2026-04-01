<?php

use App\Http\Controllers\ClaimController;
use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\ContractController;
use Illuminate\Foundation\Application;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/admin/dashboard');
    }
    return Inertia::render('Auth/Login');
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::middleware([''])->prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard
    // Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Claims Management
    Route::get('/claims', [ClaimController::class, 'index'])->name('claims.index');
    Route::get('/claims/create', [ClaimController::class, 'create'])->name('claims.create');
    Route::post('/claims', [ClaimController::class, 'store'])->name('claims.store');
    Route::get('/claims/{id}/edit', [ClaimController::class, 'edit'])->name('claims.edit');
    Route::put('/claims/{id}', [ClaimController::class, 'update'])->name('claims.update');
    Route::get('/get-contract/{policy_no}', [ClaimController::class, 'getContractDetails'])->name('get.contract');
    Route::delete('/claims/{id}', [ClaimController::class, 'destroy'])->name('claims.destroy');
    Route::patch('/claims/{id}/status', [ClaimController::class, 'updateStatus'])->name('claims.status');

    // Contracts
    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');

    // Superadmin Only Routes
    Route::middleware(['role:superadmin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';