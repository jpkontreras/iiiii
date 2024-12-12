<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\MenuItemController;
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


    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Onboarding Routes
    Route::get('/onboarding', OnboardingController::class);
    Route::post('/onboarding/start', [OnboardingController::class, 'start'])->name('onboarding.start');
    Route::get('/onboarding/restaurant', [OnboardingController::class, 'showRestaurant'])->name('onboarding.restaurants.show');
    Route::post('/onboarding/restaurant', [OnboardingController::class, 'storeRestaurant'])->name('onboarding.restaurants');

    // Restaurant Routes
    Route::resource('restaurants', RestaurantController::class)->names("restaurants");
    Route::resource('restaurants.menus', MenuController::class)->names("restaurants.menus");
    Route::get('restaurants/{restaurant}/menus/{menu}/items', [MenuItemController::class, 'index'])
        ->name('restaurants.menus.items.index');

    // Restaurant Additional Features
    Route::get('/restaurants/{restaurant}/dashboard', [DashboardController::class, 'showRestaurantDashboard'])
        ->name('restaurants.dashboard');
    Route::get('/restaurants/{restaurant}/reservations', [RestaurantController::class, 'showReservations'])->name('restaurants.reservations');
    Route::get('/restaurants/{restaurant}/reports', [RestaurantController::class, 'showReports'])->name('restaurants.reports');
    Route::get('/restaurants/{restaurant}/staff', [RestaurantController::class, 'showStaff'])->name('restaurants.staff');
});

require __DIR__ . '/auth.php';
