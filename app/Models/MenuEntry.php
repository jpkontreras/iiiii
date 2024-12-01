<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final class MenuEntry extends Model
{
  protected $fillable = [
    'path',
    'name',
    'description',
    'price',
    'menu_id',
    'position',
    'is_active'
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'is_active' => 'boolean',
    'position' => 'float'
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function tags(): BelongsToMany
  {
    return $this->belongsToMany(Tag::class, 'menu_entry_tag');
  }

  public function options(): BelongsToMany
  {
    return $this->belongsToMany(MenuOptionType::class, 'menu_entry_options')
      ->withPivot('is_required', 'order')
      ->orderBy('order');
  }

  public function scopeRootCategories(Builder $query, int $menuId): Builder
  {
    return $query->with([
      'tags',
      'options.values'
    ])
      ->where('menu_id', $menuId)
      ->where('path', 'not like', '%/%') // Exclude modifier paths
      ->where('path', 'not like', '%.%') // Get only top-level categories
      ->orderBy('position');
  }

  public function scopeGetChildren(Builder $query, string $parentPath): Builder
  {
    return $query->where('path', 'like', $parentPath . '.%')
      ->where('path', 'not like', $parentPath . '.%.%') // Only immediate children
      ->orderBy('position');
  }

  public function scopeGetModifiers(Builder $query, string $itemPath): Builder
  {
    return $query->where('path', 'like', $itemPath . '/%')
      ->orderBy('position');
  }

  public function formatForDisplay(): array
  {
    $pathParts = explode('.', $this->path);
    $isModifier = str_contains($this->path, '/+');

    // Check for descendants
    $hasChildren = static::where('path', 'like', $this->path . '.%')
      ->orWhere('path', 'like', $this->path . '/+%')
      ->exists();

    // Determine type based on path and descendants
    $type = match (true) {
      $isModifier => 'modifier',
      $hasChildren => 'category',
      default => 'item'
    };

    $baseData = [
      'id' => $this->id,
      'path' => $this->path,
      'name' => $this->name,
      'description' => $this->description,
      'price' => $this->price,
      'position' => $this->position,
      'is_active' => $this->is_active,
      'depth' => count($pathParts),
      'type' => $type,
      'tags' => $this->formatTags()
    ];

    // Only add children arrays if it actually has descendants
    if ($hasChildren && !$isModifier) {
      $baseData['items'] = static::where('path', 'like', $this->path . '.%')
        ->where('path', 'not like', $this->path . '.%.%') // Only immediate children
        ->where('path', 'not like', '%/%') // Exclude modifiers
        ->orderBy('position')
        ->get()
        ->map(function ($item) {
          $itemData = $item->formatForDisplay();
          $itemData['modifiers'] = static::where('path', 'like', $item->path . '/+%')
            ->orderBy('position')
            ->get()
            ->map->formatForDisplay()
            ->toArray();
          return $itemData;
        })
        ->toArray();
    } else if (!$isModifier) {
      $baseData['modifiers'] = static::where('path', 'like', $this->path . '/+%')
        ->orderBy('position')
        ->get()
        ->map->formatForDisplay()
        ->toArray();
    }

    return $baseData;
  }

  protected function formatTags(): array
  {
    return $this->tags->map(fn($tag) => [
      'id' => $tag->id,
      'name' => $tag->name,
      'type' => $tag->type
    ])->toArray();
  }

  protected function getChildItems(): array
  {
    return static::getChildren($this->path)
      ->with(['tags', 'options.values'])
      ->get()
      ->map->formatForDisplay()
      ->toArray();
  }

  protected function getModifierOptions(): array
  {
    return static::getModifiers($this->path)
      ->with(['tags'])
      ->get()
      ->map->formatForDisplay()
      ->toArray();
  }

  public static function getMenuStructure(Collection $entries): array
  {
    return [
      'categories' => $entries->map(function ($category) {
        return [
          'id' => $category['id'],
          'path' => $category['path'],
          'name' => $category['name'],
          'itemCount' => count($category['items'] ?? []),
          'hasModifiers' => collect($category['items'] ?? [])->contains(
            fn($item) => !empty($item['modifiers'])
          )
        ];
      }),
      'stats' => [
        'totalCategories' => $entries->count(),
        'totalItems' => $entries->sum(fn($category) => count($category['items'] ?? [])),
        'totalModifiers' => $entries->sum(function ($category) {
          return collect($category['items'] ?? [])->sum(
            fn($item) => count($item['modifiers'] ?? [])
          );
        })
      ]
    ];
  }
}
