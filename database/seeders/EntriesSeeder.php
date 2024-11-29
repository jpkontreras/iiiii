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
        // First, create tags
        $tags = $this->createTags();

        // Create main categories first
        $categories = $this->createCategories();

        // Create items under categories
        $this->createMenuItems($categories, $tags);
    }

    private function createTags(): array
    {
        // Disable triggers for PostgreSQL
        DB::statement('ALTER TABLE menu_entry_tag DISABLE TRIGGER ALL;');
        DB::statement('ALTER TABLE tags DISABLE TRIGGER ALL;');

        // Clear existing data
        DB::table('menu_entry_tag')->delete();
        DB::table('tags')->delete();

        $tags = [
            ['name' => 'Vegetarian', 'type' => 'dietary'],
            ['name' => 'Vegan', 'type' => 'dietary'],
            ['name' => 'Gluten-Free', 'type' => 'dietary'],
            ['name' => 'Contains Nuts', 'type' => 'allergen'],
            ['name' => 'Spicy', 'type' => 'spice_level'],
            ['name' => 'Very Spicy', 'type' => 'spice_level'],
            ['name' => 'Dairy-Free', 'type' => 'dietary'],
            ['name' => 'Popular', 'type' => 'feature'],
            ['name' => 'Chef\'s Special', 'type' => 'feature'],
        ];

        foreach ($tags as $tag) {
            DB::table('tags')->insert([
                ...$tag,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        // Re-enable triggers for PostgreSQL
        DB::statement('ALTER TABLE menu_entry_tag ENABLE TRIGGER ALL;');
        DB::statement('ALTER TABLE tags ENABLE TRIGGER ALL;');

        return DB::table('tags')->pluck('id', 'name')->toArray();
    }

    private function createCategories(): array
    {
        $categories = [
            // Pure categories
            [
                'name' => 'Starters',
                'description' => 'Begin your meal with these delightful appetizers',
                'menu_id' => 1,
                'properties' => null,
                'is_available' => true,
                'order' => 1,
            ],
            // Category with shared properties
            [
                'name' => 'Fresh Salads',
                'description' => 'Crisp, fresh salads made to order',
                'menu_id' => 1,
                'properties' => json_encode([
                    'base_ingredients' => ['Mixed Greens', 'Cherry Tomatoes', 'Cucumber'],
                    'dressing_options' => ['Balsamic', 'Ranch', 'Lemon Vinaigrette'],
                ]),
                'is_available' => true,
                'order' => 2,
            ],
            [
                'name' => 'Main Courses',
                'description' => 'Hearty main dishes',
                'menu_id' => 1,
                'properties' => null,
                'is_available' => true,
                'order' => 3,
            ],
            [
                'name' => 'Build Your Own',
                'description' => 'Customize your perfect meal',
                'menu_id' => 1,
                'properties' => null,
                'is_available' => true,
                'order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('menu_entries')->insert([
                ...$category,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        return DB::table('menu_entries')->pluck('id', 'name')->toArray();
    }

    private function createMenuItems(array $categories, array $tags): void
    {
        // Starters
        $this->createStarters($categories['Starters'], $tags);

        // Salads with shared properties
        $this->createSalads($categories['Fresh Salads'], $tags);

        // Main courses
        $this->createMainCourses($categories['Main Courses'], $tags);

        // Customizable items
        $this->createCustomizableItems($categories['Build Your Own'], $tags);
    }

    private function createStarters(int $parentId, array $tags): void
    {
        $starters = [
            [
                'name' => 'Bruschetta',
                'description' => 'Toasted bread with fresh tomatoes, garlic, and basil',
                'price' => 8.99,
                'parent_id' => $parentId,
                'menu_id' => 1,
                'properties' => null,
                'photo_path' => 'starters/bruschetta.jpg',
                'is_available' => true,
                'order' => 1,
                'tags' => ['Vegetarian', 'Popular']
            ],
            // Add more starters...
        ];

        $this->insertMenuItems($starters, $tags);
    }

    private function createSalads(int $parentId, array $tags): void
    {
        $salads = [
            [
                'name' => 'Greek Salad',
                'description' => 'Traditional Greek salad with feta cheese and olives',
                'price' => 12.99,
                'parent_id' => $parentId,
                'menu_id' => 1,
                'properties' => json_encode([
                    'additional_ingredients' => ['Feta Cheese', 'Kalamata Olives', 'Red Onions'],
                ]),
                'photo_path' => 'salads/greek.jpg',
                'is_available' => true,
                'order' => 1,
                'tags' => ['Vegetarian', 'Gluten-Free']
            ],
            // Add more salads...
        ];

        $this->insertMenuItems($salads, $tags);
    }

    private function createMainCourses(int $parentId, array $tags): void
    {
        $mains = [
            [
                'name' => 'Grilled Salmon',
                'description' => 'Fresh Atlantic salmon with seasonal vegetables',
                'price' => 24.99,
                'parent_id' => $parentId,
                'menu_id' => 1,
                'properties' => json_encode([
                    'cooking_options' => ['Medium Rare', 'Medium', 'Well Done'],
                    'sides' => ['Roasted Potatoes', 'Steam Vegetables', 'Rice Pilaf']
                ]),
                'photo_path' => 'mains/salmon.jpg',
                'is_available' => true,
                'order' => 1,
                'tags' => ['Gluten-Free', 'Popular']
            ],
            // Add more main courses...
        ];

        $this->insertMenuItems($mains, $tags);
    }

    private function createCustomizableItems(int $parentId, array $tags): void
    {
        $customItems = [
            [
                'name' => 'Build Your Pasta',
                'description' => 'Create your perfect pasta dish',
                'price' => 14.99,
                'parent_id' => $parentId,
                'menu_id' => 1,
                'properties' => json_encode([
                    'base_price' => 14.99,
                    'pasta_options' => [
                        ['name' => 'Spaghetti', 'price' => 0],
                        ['name' => 'Penne', 'price' => 0],
                        ['name' => 'Gluten-Free Pasta', 'price' => 2],
                    ],
                    'sauce_options' => [
                        ['name' => 'Marinara', 'price' => 0],
                        ['name' => 'Alfredo', 'price' => 2],
                        ['name' => 'Pesto', 'price' => 2],
                    ],
                    'protein_options' => [
                        ['name' => 'Grilled Chicken', 'price' => 4],
                        ['name' => 'Shrimp', 'price' => 6],
                        ['name' => 'Plant-Based Protein', 'price' => 4],
                    ],
                ]),
                'photo_path' => 'custom/pasta.jpg',
                'is_available' => true,
                'order' => 1,
                'tags' => ['Popular']
            ],
            // Add more customizable items...
        ];

        $this->insertMenuItems($customItems, $tags);
    }

    private function insertMenuItems(array $items, array $tags): void
    {
        foreach ($items as $item) {
            $itemTags = $item['tags'] ?? [];
            unset($item['tags']);

            $entryId = DB::table('menu_entries')->insertGetId([
                ...$item,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // Attach tags without timestamps
            foreach ($itemTags as $tagName) {
                if (isset($tags[$tagName])) {
                    DB::table('menu_entry_tag')->insert([
                        'menu_entry_id' => $entryId,
                        'tag_id' => $tags[$tagName],
                    ]);
                }
            }
        }
    }
}
