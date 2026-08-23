<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\DonorController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\SessionController;
use App\Http\Controllers\API\DonationController;
use App\Http\Controllers\API\BloodStockController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard-stats', [DashboardController::class, 'index']);
    
    Route::apiResource('donors', DonorController::class);
    Route::apiResource('sessions', SessionController::class);
    Route::apiResource('donations', DonationController::class);
    Route::apiResource('blood-stocks', BloodStockController::class);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::delete('/donors/{id}', [DonorController::class, 'destroy']);
    
        // Hospital Requests
        Route::get('/hospital-requests', [\App\Http\Controllers\API\HospitalRequestController::class, 'index']);
        Route::post('/hospital-requests', [\App\Http\Controllers\API\HospitalRequestController::class, 'store']);
        Route::post('/hospital-requests/{id}/fulfill', [\App\Http\Controllers\API\HospitalRequestController::class, 'fulfill']);
    });
});
?>