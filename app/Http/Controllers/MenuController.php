<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Models\Menu;
use App\Models\Restaurant;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class MenuController extends Controller
{


  public function index(Restaurant $restaurant): Response
  {
    return Inertia::render('Menu/Index', [
      'restaurant' => $restaurant,
      'menus' => $restaurant->menus()
        ->with(['menuItems' => function ($query) {
          $query->with(['category', 'tags']);
        }])
        ->get(),
    ]);
  }

  public function create(Restaurant $restaurant): Response
  {
    return Inertia::render('Menu/Create', [
      'restaurant' => $restaurant,
    ]);
  }

  public function store(StoreMenuRequest $request, Restaurant $restaurant): RedirectResponse
  {
    $menu = $restaurant->menus()->create([
      'name' => $request->input('name'),
      'description' => $request->input('description'),
      'is_active' => $request->boolean('is_active', true),
    ]);

    return redirect()
      ->route('restaurants.menus.entries.index', [
        'restaurant' => $restaurant->id,
        'menu' => $menu->id,
      ])
      ->with('success', __('menu.created'));
  }

  public function show(Restaurant $restaurant, Menu $menu): Response
  {
    $menu->load(['menuItems' => function ($query) {
      $query->with(['category', 'tags']);
    }]);

    return Inertia::render('Menu/Show', [
      'restaurant' => $restaurant,
      'menu' => $menu,
    ]);
  }

  public function edit(Restaurant $restaurant, Menu $menu): Response
  {
    $menu->load(['menuItems' => function ($query) {
      $query->with(['category', 'tags']);
    }]);

    return Inertia::render('Menu/Edit', [
      'restaurant' => $restaurant,
      'menu' => $menu,
    ]);
  }

  public function update(UpdateMenuRequest $request, Restaurant $restaurant, Menu $menu): RedirectResponse
  {
    $menu->update([
      'name' => $request->input('name'),
      'description' => $request->input('description'),
      'is_active' => $request->boolean('is_active'),
    ]);

    return redirect()
      ->route('restaurants.menus.entries.index', [
        'restaurant' => $restaurant->id,
        'menu' => $menu->id,
      ])
      ->with('success', __('menu.updated'));
  }

  public function destroy(Restaurant $restaurant, Menu $menu): RedirectResponse
  {
    $menu->delete();

    return redirect()
      ->route('restaurants.menus.index', $restaurant)
      ->with('success', __('menu.deleted'));
  }
}
