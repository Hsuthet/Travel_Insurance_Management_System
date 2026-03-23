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

Route::get('/benefits', [BenefitController::class, 'index']);


// Apply,Contracts
Route::post('/apply', [ContractController::class, 'apply']);
Route::get('/contracts', [ContractController::class, 'index']);

//Customers
//Route::post('/customers', [CustomerController::class, 'store']);
Route::get('/customers',[CustomerController::class, 'index']);

//Payments
Route::post('/payments', [PaymentController::class, 'store']);

//Claims
Route::post('/claims', [ClaimController::class, 'store']);

//Benefits 
Route::get('/plans/{plan_id}/benefits', [BenefitController::class, 'getByPlan']);
Route::get('/benefits', [BenefitController::class, 'index']);

//Declarations
Route::get('/plans/{plan_id}/declarations', [DeclarationController::class, 'getByPlan']);
Route::post('/declaration-results', [DeclarationController::class, 'storeResults']);

//Payment

Route::post('/payment/success/{id}', [PaymentController::class, 'store']);