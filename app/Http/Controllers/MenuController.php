<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Models\Menu;
use App\Models\Restaurant;
use App\Services\MenuImportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use App\Jobs\ProcessMenuFiles;

final class MenuController extends Controller
{
  public function __construct(
    private readonly MenuImportService $menuImportService
  ) {}

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
      'template_type' => $request->input('template_type'),
      'is_active' => $request->boolean('is_active', true),
    ]);

    // Dispatch jobs for processing files and items
    if ($request->hasFile('files')) {
      ProcessMenuFiles::dispatch($menu, $request->file('files'));
    }

    return redirect()
      ->route('restaurants.menus.show', [
        'restaurant' => $restaurant->id,
        'menu' => $menu->id,
      ])
      ->with('success', __('menu.created_processing'));
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
    try {
      DB::beginTransaction();

      $menu->update([
        'name' => $request->input('name'),
        'description' => $request->input('description'),
        'template_type' => $request->input('template_type'),
        'is_active' => $request->boolean('is_active'),
      ]);

      // Process new file uploads if any
      if ($request->hasFile('files')) {
        $importErrors = [];
        foreach ($request->file('files') as $file) {
          try {
            $this->menuImportService->processFile($menu, $file);
          } catch (\Exception $e) {
            $importErrors[] = "Error processing {$file->getClientOriginalName()}: {$e->getMessage()}";
          }
        }

        if (!empty($importErrors)) {
          DB::commit();
          return redirect()
            ->route('restaurants.menus.show', [
              'restaurant' => $restaurant->id,
              'menu' => $menu->id,
            ])
            ->with('warning', 'Menu updated but some files failed to import: ' . implode(', ', $importErrors));
        }
      }

      // Handle menu items updates
      if ($request->has('items')) {
        foreach ($request->input('items') as $itemData) {
          if (isset($itemData['id'])) {
            // Update existing item
            $item = $menu->menuItems()->findOrFail($itemData['id']);
            $item->update([
              'name' => $itemData['name'],
              'description' => $itemData['description'] ?? null,
              'price' => $itemData['price'],
              'category_id' => $itemData['category_id'] ?? null,
              'is_available' => $itemData['is_available'] ?? true,
            ]);

            // Sync tags if provided
            if (isset($itemData['tags'])) {
              $item->tags()->sync($itemData['tags']);
            }
          } else {
            // Create new item
            $item = $menu->menuItems()->create([
              'name' => $itemData['name'],
              'description' => $itemData['description'] ?? null,
              'price' => $itemData['price'],
              'category_id' => $itemData['category_id'] ?? null,
              'is_available' => $itemData['is_available'] ?? true,
            ]);

            // Attach tags if provided
            if (isset($itemData['tags'])) {
              $item->tags()->attach($itemData['tags']);
            }
          }
        }
      }

      // Handle menu items deletion
      if ($request->has('items_to_delete')) {
        $menu->menuItems()->whereIn('id', $request->input('items_to_delete'))->delete();
      }

      DB::commit();

      return redirect()
        ->route('restaurants.menus.show', [
          'restaurant' => $restaurant->id,
          'menu' => $menu->id,
        ])
        ->with('success', 'Menu updated successfully.');
    } catch (\Exception $e) {
      DB::rollBack();

      return redirect()
        ->route('restaurants.menus.edit', [
          'restaurant' => $restaurant->id,
          'menu' => $menu->id,
        ])
        ->with('error', 'Failed to update menu: ' . $e->getMessage());
    }
  }

  public function destroy(Restaurant $restaurant, Menu $menu): RedirectResponse
  {
    try {
      $menu->delete();

      return redirect()
        ->route('restaurants.menus.index', $restaurant->id)
        ->with('success', 'Menu deleted successfully.');
    } catch (\Exception $e) {
      return redirect()
        ->route('restaurants.menus.index', $restaurant->id)
        ->with('error', 'Failed to delete menu: ' . $e->getMessage());
    }
  }
}
