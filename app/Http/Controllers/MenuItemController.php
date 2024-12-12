<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
  public function index(Request $request, Restaurant $restaurant, Menu $menu): Response
  {

    $menuItems = MenuItem::with([
      'variations' => fn($q) => $q->where('is_active', true),
      'modifierGroups' => fn($q) => $q->with([
        'modifiers' => fn($mq) => $mq->where('is_active', true)
      ])->where('is_active', true),
      'category',
    ])
      ->where('menu_id', $menu->id)
      ->where('is_active', true)
      ->get();

    $categories = $menu->categories()
      ->with(['children'])
      ->whereNull('parent_id')
      ->get();

    return Inertia::render('MenuItem/Index', [
      'restaurant' => [
        'id' => $restaurant->id,
        'name' => $restaurant->name,
      ],
      'menu' => [
        'id' => $menu->id,
        'name' => $menu->name,
      ],
      'entries' => $this->buildCategoryTree($categories, $menuItems),
    ]);
  }

  private function buildCategoryTree(Collection $categories, Collection $menuItems): array
  {
    return $categories->map(function ($category) use ($menuItems) {
      $categoryItems = $menuItems->where('category_id', $category->id)->values();

      $node = [
        'id' => $category->id,
        'name' => $category->name,
        'type' => 'category',
        'children' => [],
      ];

      // Add menu items for this category
      foreach ($categoryItems as $item) {
        $node['children'][] = [
          'id' => $item->id,
          'name' => $item->name,
          'type' => 'item',
          'data' => [
            'slug' => $item->slug,
            'description' => $item->description,
            'base_price' => (float) $item->base_price,
            'image_path' => $item->image_path,
            'variations' => $item->variations->map(fn($v) => [
              'id' => $v->id,
              'name' => $v->name,
              'price_adjustment' => (float) $v->price_adjustment,
              'is_default' => $v->is_default,
              'is_active' => $v->is_active,
            ]),
            'modifier_groups' => $item->modifierGroups->map(fn($g) => [
              'id' => $g->id,
              'name' => $g->name,
              'min_selections' => $g->min_selections,
              'max_selections' => $g->max_selections,
              'is_required' => $g->is_required,
              'pivot' => [
                'menu_item_id' => $item->id,
                'modifier_group_id' => $g->id,
              ],
              'modifiers' => $g->modifiers->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'price_adjustment' => (float) $m->price_adjustment,
                'is_default' => $m->is_default,
                'is_active' => $m->is_active,
                'modifier_group_id' => $g->id,
              ]),
            ]),
          ],
        ];
      }

      // Recursively add child categories
      if ($category->children->isNotEmpty()) {
        $node['children'] = array_merge(
          $node['children'],
          $this->buildCategoryTree($category->children, $menuItems)
        );
      }

      return $node;
    })->all();
  }
}
