<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
  public function handle(): RedirectResponse
  {
    /** @var User $user */
    $user = Auth::user();
    $restaurants = Restaurant::where('user_id', $user->getAuthIdentifier())->get();

    // If user has no restaurants, redirect to restaurant creation
    if ($restaurants->isEmpty()) {
      return redirect()->route('restaurant.create');
    }

    // If user has exactly one restaurant, redirect to that restaurant's dashboard
    if ($restaurants->count() === 1) {
      $restaurant = $restaurants->first();
      return redirect()->route('restaurant.dashboard', ['restaurant' => $restaurant->id]);
    }

    // If user has multiple restaurants, redirect to restaurant index
    return redirect()->route('restaurant.index');
  }

  public function showRestaurantDashboard(Restaurant $restaurant): Response
  {
    // Check if user owns this restaurant
    if ($restaurant->user_id !== Auth::id()) {
      abort(403);
    }

    $hasMenu = $restaurant->menus()->exists();

    return Inertia::render('Restaurant/Dashboard', [
      'restaurant' => [
        'id' => $restaurant->id,
        'name' => $restaurant->name,
        'hasMenu' => $hasMenu,
      ],
    ]);
  }
}
