<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Menu;
use App\Models\MenuEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

final class MenuEntryFactory extends Factory
{
  protected $model = MenuEntry::class;

  public function definition(): array
  {
    return [
      'name' => $this->faker->word,
      'description' => $this->faker->sentence,
      'price' => $this->faker->randomFloat(2, 1, 100),
      'menu_id' => Menu::factory(),
      'parent_id' => null,
      'properties' => [],
      'photo_path' => null,
      'is_available' => true,
      'order' => $this->faker->numberBetween(0, 100)
    ];
  }
}
