<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EntriesSeeder extends Seeder
{
    public function run(): void
    {
        $this->createTags();
        $this->createMenuOptionTypes();
        $this->createMenuOptionValues();
        $this->createMenuEntries();
    }

    private function createTags(): void
    {
        DB::table('tags')->insert([
            ['name' => 'Vegetarian', 'type' => 'dietary'],
            ['name' => 'Vegan', 'type' => 'dietary'],
            ['name' => 'Gluten-Free', 'type' => 'dietary'],
            ['name' => 'Contains Nuts', 'type' => 'allergen'],
            ['name' => 'Spicy', 'type' => 'spice_level'],
            ['name' => 'Very Spicy', 'type' => 'spice_level'],
            ['name' => 'Dairy-Free', 'type' => 'dietary'],
            ['name' => 'Popular', 'type' => 'feature'],
            ['name' => 'Chef\'s Special', 'type' => 'feature'],
        ]);
    }

    private function createMenuOptionTypes(): void
    {
        DB::table('menu_option_types')->insert([
            ['code' => 'size', 'name' => 'Size', 'is_required' => true, 'order' => 1],
            ['code' => 'temp', 'name' => 'Temperature', 'is_required' => true, 'order' => 2],
            ['code' => 'milk', 'name' => 'Milk Type', 'is_required' => false, 'order' => 3],
            ['code' => 'extra_shot', 'name' => 'Extra Shot', 'is_required' => false, 'order' => 4],
            ['code' => 'protein', 'name' => 'Protein', 'is_required' => true, 'order' => 1],
            ['code' => 'cooking_temp', 'name' => 'Cooking Temperature', 'is_required' => true, 'order' => 2],
            ['code' => 'sides', 'name' => 'Side Dishes', 'is_required' => false, 'order' => 3],
            ['code' => 'toppings', 'name' => 'Toppings', 'is_required' => false, 'order' => 4],
            ['code' => 'spice_level', 'name' => 'Spice Level', 'is_required' => false, 'order' => 5],
        ]);
    }

    private function createMenuOptionValues(): void
    {
        $types = DB::table('menu_option_types')->get();

        foreach ($types as $type) {
            switch ($type->code) {
                case 'size':
                    $this->insertOptionValues($type->id, [
                        ['code' => 'small', 'name' => 'Small', 'price_adjustment' => 0],
                        ['code' => 'medium', 'name' => 'Medium', 'price_adjustment' => 1],
                        ['code' => 'large', 'name' => 'Large', 'price_adjustment' => 2],
                    ]);
                    break;
                case 'temp':
                    $this->insertOptionValues($type->id, [
                        ['code' => 'hot', 'name' => 'Hot', 'price_adjustment' => 0],
                        ['code' => 'iced', 'name' => 'Iced', 'price_adjustment' => 0],
                    ]);
                    break;
                case 'milk':
                    $this->insertOptionValues($type->id, [
                        ['code' => 'whole', 'name' => 'Whole Milk', 'price_adjustment' => 0],
                        ['code' => 'skim', 'name' => 'Skim Milk', 'price_adjustment' => 0],
                        ['code' => 'oat', 'name' => 'Oat Milk', 'price_adjustment' => 1],
                        ['code' => 'almond', 'name' => 'Almond Milk', 'price_adjustment' => 1],
                    ]);
                    break;
                    // Add more cases for other option types...
            }
        }
    }

    private function createMenuEntries(): void
    {
        // Root Categories
        $this->createEntry('beverages', 'Beverages', null, 1);
        $this->createEntry('food', 'Food', null, 2);

        // Beverage Categories
        $this->createEntry('beverages.hot', 'Hot Drinks', null, 1);
        $this->createEntry('beverages.cold', 'Cold Drinks', null, 2);
        $this->createEntry('beverages.smoothies', 'Smoothies', null, 3);

        // Hot Drinks
        $this->createEntry('beverages.hot.coffee', 'Coffee', null, 1);
        $this->createEntry('beverages.hot.tea', 'Tea', null, 2);

        // Coffee Items
        $this->createEntry('beverages.hot.coffee.espresso', 'Espresso', 3.50, 1);
        $this->createEntry('beverages.hot.coffee.latte', 'Latte', 4.50, 2);
        $this->createEntry('beverages.hot.coffee.cappuccino', 'Cappuccino', 4.50, 3);
        $this->createEntry('beverages.hot.coffee.americano', 'Americano', 3.75, 4);

        // Coffee Modifiers
        $this->createEntry('beverages.hot.coffee.latte/+size.small', 'Small', 0, 1);
        $this->createEntry('beverages.hot.coffee.latte/+size.medium', 'Medium', 0.75, 2);
        $this->createEntry('beverages.hot.coffee.latte/+size.large', 'Large', 1.50, 3);
        $this->createEntry('beverages.hot.coffee.latte/+milk.whole', 'Whole Milk', 0, 1);
        $this->createEntry('beverages.hot.coffee.latte/+milk.oat', 'Oat Milk', 1, 2);

        // Tea Items
        $this->createEntry('beverages.hot.tea.green', 'Green Tea', 3.00, 1);
        $this->createEntry('beverages.hot.tea.earl_grey', 'Earl Grey', 3.00, 2);
        $this->createEntry('beverages.hot.tea.chai_latte', 'Chai Latte', 4.50, 3);

        // Cold Drinks
        $this->createEntry('beverages.cold.iced_coffee', 'Iced Coffee', 4.00, 1);
        $this->createEntry('beverages.cold.cold_brew', 'Cold Brew', 4.50, 2);
        $this->createEntry('beverages.cold.iced_tea', 'Iced Tea', 3.50, 3);

        // Food Categories
        $this->createEntry('food.breakfast', 'Breakfast', null, 1);
        $this->createEntry('food.lunch', 'Lunch', null, 2);
        $this->createEntry('food.pastries', 'Pastries', null, 3);

        // Breakfast Items
        $this->createEntry('food.breakfast.eggs_benedict', 'Eggs Benedict', 12.99, 1);
        $this->createEntry('food.breakfast.avocado_toast', 'Avocado Toast', 9.99, 2);
        $this->createEntry('food.breakfast.pancakes', 'Pancakes', 10.99, 3);

        // Breakfast Modifiers
        $this->createEntry('food.breakfast.eggs_benedict/+protein.ham', 'Ham', 0, 1);
        $this->createEntry('food.breakfast.eggs_benedict/+protein.salmon', 'Salmon', 3, 2);
        $this->createEntry('food.breakfast.pancakes/+toppings.berries', 'Mixed Berries', 2, 1);
        $this->createEntry('food.breakfast.pancakes/+toppings.chocolate', 'Chocolate Chips', 1.50, 2);

        // Continue with more categories, items, and modifiers...
    }

    private function createEntry(string $path, string $name, ?float $price, int $position): void
    {
        DB::table('menu_entries')->insert([
            'path' => $path,
            'name' => $name,
            'description' => "Description for $name",
            'price' => $price,
            'menu_id' => 1, // Assuming we're working with menu ID 1
            'position' => $position,
            'is_active' => true,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }

    private function insertOptionValues(int $typeId, array $values): void
    {
        foreach ($values as $value) {
            DB::table('menu_option_values')->insert([
                'menu_option_type_id' => $typeId,
                'code' => $value['code'],
                'name' => $value['name'],
                'price_adjustment' => $value['price_adjustment'],
                'order' => 0,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
