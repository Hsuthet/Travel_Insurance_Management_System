<?php

use App\Http\Controllers\ClaimController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\ReportController;
use Illuminate\Foundation\Application;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\PremiumController;

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




// Route::middleware(['auth', 'role:superadmin'])->group(function () {
//     Route::get('/admin/users', [UserController::class, 'index']);
// });

Route::middleware(['auth', 'role:superadmin'])->prefix('admin')->group(function () {
    // List Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index');

    // Create User Form
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');

    // Store User
    Route::post('/users', [UserController::class, 'store'])->name('users.store');

    // Edit User Form 
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');

    // Update User
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');

    // Delete User 
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/premium', [PremiumController::class, 'index'])->name('admin.premium');
    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');

    // Claims Management
      Route::get('/claims', [ClaimController::class, 'index'])->name('claims.index');
    Route::get('/claims/create', [ClaimController::class, 'create'])->name('claims.create');
    Route::post('/claims', [ClaimController::class, 'store'])->name('claims.store');
    Route::get('/claims/{id}/edit', [ClaimController::class, 'edit'])->name('claims.edit');
    Route::put('/claims/{id}', [ClaimController::class, 'update'])->name('claims.update');
    Route::get('/get-contract/{policy_no}', [ClaimController::class, 'getContractDetails'])->name('get.contract');
    Route::delete('/claims/{id}', [ClaimController::class, 'destroy'])->name('claims.destroy');
    Route::patch('/claims/{id}/claim_status', [ClaimController::class, 'updateclaim_status'])->name('claims.claim_status');

});
// Route::put('/contracts/{id}/status', [ContractController::class, 'updateStatus'])->name('contracts.update-status');



Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    // Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');

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

Route::prefix('admin')->name('admin.')->group(function () {
    // The main list page
    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');

    // The View/Details page (This matches row.id or row.contract_id)
    Route::get('/contracts/{id}', [ContractController::class, 'show'])->name('contracts.show');

    // Routes for the Confirm/Reject buttons on the Detail page
    Route::patch('/contracts/{id}/confirm', [ContractController::class, 'confirm'])->name('contracts.confirm');
    Route::patch('/contracts/{id}/reject', [ContractController::class, 'reject'])->name('contracts.reject');
});
Route::put('/contracts/{id}/status', [ContractController::class, 'updateStatus'])->name('contracts.update-status');

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