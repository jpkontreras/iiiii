<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Routes
    Route::get('/dashboard', [DashboardController::class, 'handle'])->name('dashboard');
    Route::get('/restaurant/{restaurant}/dashboard', [DashboardController::class, 'showRestaurantDashboard'])
        ->name('restaurant.dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Onboarding Routes
    Route::get('/onboarding', OnboardingController::class);
    Route::post('/onboarding/start', [OnboardingController::class, 'start'])->name('onboarding.start');
    Route::get('/onboarding/restaurant', [OnboardingController::class, 'showRestaurant'])->name('onboarding.restaurant.show');
    Route::post('/onboarding/restaurant', [OnboardingController::class, 'storeRestaurant'])->name('onboarding.restaurant');

    // Restaurant Routes
    Route::resource('/restaurant', RestaurantController::class)->names("restaurant");

    // Restaurant Menu Routes
    Route::get('/restaurant/{restaurant}/menu', [RestaurantController::class, 'showMenu'])->name('restaurant.menu.edit');
    Route::get('/restaurant/{restaurant}/menu/create', [RestaurantController::class, 'createMenu'])->name('restaurant.menu.create');

    // Restaurant Additional Features
    Route::get('/restaurant/{restaurant}/reservations', [RestaurantController::class, 'showReservations'])->name('restaurant.reservations');
    Route::get('/restaurant/{restaurant}/reports', [RestaurantController::class, 'showReports'])->name('restaurant.reports');
    Route::get('/restaurant/{restaurant}/staff', [RestaurantController::class, 'showStaff'])->name('restaurant.staff');
});

require __DIR__ . '/auth.php';
