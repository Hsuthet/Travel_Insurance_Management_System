<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\GmoPaymentController;
use Inertia\Inertia;

// 1. Move this OUTSIDE the 'auth' middleware to bypass login
Route::get('/admin/payments', [PaymentController::class, 'index'])->name('admin.payments.index');

// 2. Protected Routes (Only for actions like Cancel/Process)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/payments/process', [GmoPaymentController::class, 'process'])->name('payments.process');
    Route::post('/payments/generate-token', [GmoPaymentController::class, 'generateToken'])->name('payments.token');
    Route::post('/payments/search', [GmoPaymentController::class, 'search'])->name('payments.search');
    Route::post('/payments/cancel', [GmoPaymentController::class, 'cancel'])->name('payments.cancel');
    Route::get('/payments/history', [GmoPaymentController::class, 'history'])->name('payments.history');
});

// 3. Login Route
Route::get('/login', function () {
    return redirect()->route('admin.payments.index');
})->name('login');

// 4. Redirect root to the payment page
Route::get('/', function () {
    return redirect()->route('admin.payments.index');
});