<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;


use App\Http\Controllers\Api\{
    PlanController,
    CustomerController,
    ContractController,
    ClaimController,
    BenefitController,
    DeclarationController,
    GmoPaymentController
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
 /* Route::post('/payments', [PaymentController::class, 'store']); */

//Claims
Route::post('/claims', [ClaimController::class, 'store']);

//Benefits 

Route::get('/benefits', [BenefitController::class, 'index']);

//Declarations
Route::get('/plans/{plan_id}/declarations', [DeclarationController::class, 'getByPlan']);
Route::post('/declaration-results', [DeclarationController::class, 'storeResults']);

//Payment
/* 
// --- Payments ---
 Route::prefix('payments')->group(function () {
    
    // ၁။ Table Data ကြည့်ရန် (Payment.jsx အတွက် အရေးကြီးဆုံး)
    // GET method ကို သုံးရပါမယ်၊ Method နာမည်က index ဖြစ်ရပါမယ်
    Route::get('/', [PaymentController::class, 'index'])->name('admin.payments.index');

    // ၂။ ငွေပေးချေမှု လုပ်ဆောင်ရန် (store အစား Controller ထဲက process ကို သုံးပါ)
    Route::post('/process', [PaymentController::class, 'process'])->name('payments.process');

    // ၃။ Card Token ထုတ်ရန်
    Route::post('/generate-token', [PaymentController::class, 'generateToken'])->name('payments.token');
}); */

