<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use App\Models\ItemVariation;
use App\Models\Menu;
use App\Models\MenuItem;
use App\Models\Modifier;
use App\Models\ModifierGroup;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;

class MenuSystemSeeder extends Seeder
{
  public function run(): void
  {
    $restaurant = Restaurant::first();

    if (!$restaurant) {
      $this->command->error('Please run RestaurantSeeder first!');
      return;
    }

    // Create Main Menu
    $menu = Menu::first();

    if (!$menu) {
      $this->command->error('Please run MenuSeeder first!');
      return;
    }

    // Create Categories
    $beverages = Category::create([
      'name' => 'Beverages',
      'slug' => 'beverages',
      'menu_id' => $menu->id,
      'sort_order' => 1,
      'is_active' => true,
    ]);

    $hotDrinks = Category::create([
      'name' => 'Hot Drinks',
      'slug' => 'hot-drinks',
      'menu_id' => $menu->id,
      'parent_id' => $beverages->id,
      'sort_order' => 1,
      'is_active' => true,
    ]);

    $pizzas = Category::create([
      'name' => 'Pizzas',
      'slug' => 'pizzas',
      'menu_id' => $menu->id,
      'sort_order' => 2,
      'is_active' => true,
    ]);

    // Create Modifier Groups
    $sizeOptions = ModifierGroup::create([
      'name' => 'Size Options',
      'menu_id' => $menu->id,
      'min_selections' => 1,
      'max_selections' => 1,
      'is_required' => true,
    ]);

    $milkOptions = ModifierGroup::create([
      'name' => 'Milk Options',
      'menu_id' => $menu->id,
      'min_selections' => 1,
      'max_selections' => 1,
      'is_required' => true,
    ]);

    $extraShots = ModifierGroup::create([
      'name' => 'Extra Shots',
      'menu_id' => $menu->id,
      'min_selections' => 0,
      'max_selections' => 4,
      'is_required' => false,
    ]);

    $pizzaToppings = ModifierGroup::create([
      'name' => 'Extra Toppings',
      'menu_id' => $menu->id,
      'min_selections' => 0,
      'max_selections' => 5,
      'is_required' => false,
    ]);

    // Create Size Modifiers
    Modifier::create([
      'name' => 'Regular',
      'modifier_group_id' => $sizeOptions->id,
      'price_adjustment' => 0,
      'is_default' => true,
      'is_active' => true,
    ]);

    Modifier::create([
      'name' => 'Large',
      'modifier_group_id' => $sizeOptions->id,
      'price_adjustment' => 1.00,
      'is_default' => false,
      'is_active' => true,
    ]);

    // Create Milk Modifiers
    Modifier::create([
      'name' => 'Regular Milk',
      'modifier_group_id' => $milkOptions->id,
      'price_adjustment' => 0,
      'is_default' => true,
      'is_active' => true,
    ]);

    Modifier::create([
      'name' => 'Almond Milk',
      'modifier_group_id' => $milkOptions->id,
      'price_adjustment' => 0.50,
      'is_default' => false,
      'is_active' => true,
    ]);

    Modifier::create([
      'name' => 'Oat Milk',
      'modifier_group_id' => $milkOptions->id,
      'price_adjustment' => 0.50,
      'is_default' => false,
      'is_active' => true,
    ]);

    // Create Extra Shot Modifier
    Modifier::create([
      'name' => 'Extra Shot',
      'modifier_group_id' => $extraShots->id,
      'price_adjustment' => 0.75,
      'is_default' => false,
      'is_active' => true,
    ]);

    // Create Pizza Toppings
    Modifier::create([
      'name' => 'Extra Cheese',
      'modifier_group_id' => $pizzaToppings->id,
      'price_adjustment' => 2.00,
      'is_default' => false,
      'is_active' => true,
    ]);

    Modifier::create([
      'name' => 'Pepperoni',
      'modifier_group_id' => $pizzaToppings->id,
      'price_adjustment' => 1.50,
      'is_default' => false,
      'is_active' => true,
    ]);

    // Create Menu Items
    $latte = MenuItem::create([
      'name' => 'Latte',
      'slug' => 'latte',
      'description' => 'Smooth espresso with steamed milk',
      'base_price' => 4.00,
      'menu_id' => $menu->id,
      'category_id' => $hotDrinks->id,
      'is_active' => true,
    ]);

    $margherita = MenuItem::create([
      'name' => 'Margherita Pizza',
      'slug' => 'margherita-pizza',
      'description' => 'Classic tomato sauce, mozzarella, and basil',
      'base_price' => 12.00,
      'menu_id' => $menu->id,
      'category_id' => $pizzas->id,
      'is_active' => true,
    ]);

    // Create Item Variations
    ItemVariation::create([
      'name' => 'Iced',
      'menu_item_id' => $latte->id,
      'price_adjustment' => 0.50,
      'is_default' => false,
      'is_active' => true,
    ]);

    ItemVariation::create([
      'name' => 'Extra Hot',
      'menu_item_id' => $latte->id,
      'price_adjustment' => 0,
      'is_default' => false,
      'is_active' => true,
    ]);

    // Attach Modifier Groups to Menu Items
    $latte->modifierGroups()->attach([
      $sizeOptions->id,
      $milkOptions->id,
      $extraShots->id,
    ]);

    $margherita->modifierGroups()->attach([
      $pizzaToppings->id,
    ]);
  }
}
