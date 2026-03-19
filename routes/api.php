<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\{
    PlanController,
    CustomerController,
    ContractController,
    PaymentController,
    ClaimController,
    BenefitController,
    DeclarationController
};

Route::get('/test', function () {
    return response()->json(['message' => 'API OK']);
});

// Plans
Route::get('/plans', [PlanController::class, 'index']);
Route::get('/plans/{id}', [PlanController::class, 'show']);

// Apply
Route::post('/apply', [ContractController::class, 'apply']);

//Customers
Route::post('/customers', [CustomerController::class, 'store']);

//Payments
Route::post('/payments', [PaymentController::class, 'store']);

//Claims
Route::post('/claims', [ClaimController::class, 'store']);

//Benefits & Declarations
Route::get('/plans/{plan_id}/benefits', [BenefitController::class, 'getByPlan']);
Route::get('/plans/{plan_id}/declarations', [DeclarationController::class, 'getByPlan']);