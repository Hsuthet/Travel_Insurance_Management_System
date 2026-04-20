<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ClaimController;
use App\Http\Controllers\Api\BenefitController;
use App\Http\Controllers\Api\DeclarationController;

Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

// Plans
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{id}', [PlanController::class, 'show']);

Route::get('/benefits', [BenefitController::class, 'index']);


// Apply,Contracts
Route::post('/apply', [ContractController::class, 'apply']);
Route::get('/contracts', [ContractController::class, 'index']);

//Customers
//Route::post('/customers', [CustomerController::class, 'store']);
Route::get('/customers',[CustomerController::class, 'index']);

//Payments
 /* Route::post('/payments', [PaymentController::class, 'store']); */

//Claims
Route::post('/claims', [ClaimController::class, 'store']);

//Benefits 

Route::get('/benefits', [BenefitController::class, 'index']);

//Declarations
Route::get('/plans/{plan_id}/declarations', [DeclarationController::class, 'getByPlan']);
Route::post('/declaration-results', [DeclarationController::class, 'storeResults']);

//Payment

// Route::post('/payment/success/{id}', [PaymentController::class, 'store']);

// Admin Contract Management
Route::prefix('admin/contracts')->group(function () {
    Route::patch('/{id}/approve', [ContractController::class, 'approve']);
    Route::patch('/{id}/reject', [ContractController::class, 'reject']);
    Route::patch('/{id}/cancel', [ContractController::class, 'cancel']);
});