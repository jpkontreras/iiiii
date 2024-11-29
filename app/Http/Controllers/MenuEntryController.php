<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuEntry;
use App\Http\Requests\MenuEntryRequest;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

final class MenuEntryController extends Controller
{
  public function index(Restaurant $restaurant, Menu $menu): Response
  {
    $entries = MenuEntry::rootCategories($menu->id)
      ->get()
      ->map->formatForDisplay();

    return Inertia::render('Entries/Index', [
      'menu' => $menu->load('restaurant'),
      'restaurant' => $menu->restaurant,
      'groupedItems' => $entries,
      'structure' => MenuEntry::getMenuStructure($entries)
    ]);
  }

  public function store(MenuEntryRequest $request): JsonResponse
  {
    $entry = MenuEntry::create($request->validated());
    return response()->json($entry, 201);
  }

  public function show(MenuEntry $entry): JsonResponse
  {
    return response()->json($entry->load(['tags', 'children']));
  }

  public function update(MenuEntryRequest $request, MenuEntry $entry): JsonResponse
  {
    $entry->update($request->validated());
    return response()->json($entry);
  }

  public function destroy(MenuEntry $entry): JsonResponse
  {
    $entry->delete();
    return response()->json(null, 204);
  }
}
