<?php

use App\Http\Controllers\ClaimController;
use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\DashboardController;
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

    // Route::get('/contracts', fn() => Inertia::render('Admin/Contracts'))->name('admin.contracts');
    // Route::get('/premiums', fn() => Inertia::render('Admin/Premiums'))->name('admin.premiums');
    Route::get('/reports', [ReportController::class, 'index'])->name('admin.reports');
   
});
    

Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
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

// 4. Redirect root to the payment page
Route::get('/', function () {
    return redirect()->route('admin.payments.index');
});