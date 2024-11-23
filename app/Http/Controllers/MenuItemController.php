<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Restaurant $restaurant, Menu $menu): Response
    {
        // Eager load menu items with their relationships
        $menu->load(['menuItems' => function ($query) {
            $query->with(['category', 'tags'])
                ->orderBy('category_id')
                ->orderBy('name');
        }]);

        return Inertia::render('MenuItems/Index', [
            'restaurant' => $restaurant,
            'menu' => $menu,
        ]);
    }

    /**
     * Quick add multiple menu items.
     */
    public function quickAdd(Request $request, Restaurant $restaurant, Menu $menu)
    {
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.name' => 'required|string|max:255',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.description' => 'nullable|string',
        ]);

        foreach ($validated['items'] as $item) {
            $menu->menuItems()->create([
                'name' => $item['name'],
                'price' => $item['price'],
                'description' => $item['description'],
                'is_available' => true,
            ]);
        }

        return back()->with('success', __('menu_items.quick_add_success'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
