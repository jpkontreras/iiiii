<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

final class MenuEntry extends Model
{
  protected $fillable = [
    'name',
    'description',
    'price',
    'menu_id',
    'parent_id',
    'properties',
    'photo_path',
    'is_available',
    'order'
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'is_available' => 'boolean',
    'properties' => 'array',
    'order' => 'integer'
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function parent(): BelongsTo
  {
    return $this->belongsTo(MenuEntry::class, 'parent_id');
  }

  public function children(): HasMany
  {
    return $this->hasMany(MenuEntry::class, 'parent_id')->orderBy('order');
  }

  public function tags(): BelongsToMany
  {
    return $this->belongsToMany(Tag::class, 'menu_entry_tag');
  }

  public function scopeRootCategories($query, int $menuId)
  {
    return $query->with([
      'tags',
      'children' => fn($q) => $q->orderBy('order'),
      'children.tags',
      'children.children' => fn($q) => $q->orderBy('order'),
      'children.children.tags'
    ])
      ->where('menu_id', $menuId)
      ->whereNull('parent_id')
      ->orderBy('order');
  }

  public function formatForDisplay(): array
  {
    return [
      'id' => $this->id,
      'name' => $this->name,
      'description' => $this->description,
      'price' => $this->price,
      'properties' => $this->properties,
      'photo_path' => $this->photo_path,
      'is_available' => $this->is_available,
      'order' => $this->order,
      'tags' => $this->formatTags(),
      'items' => $this->formatItems(),
    ];
  }

  protected function formatTags(): array
  {
    return $this->tags->map(fn($tag) => [
      'id' => $tag->id,
      'name' => $tag->name,
      'type' => $tag->type
    ])->toArray();
  }

  protected function formatItems(): array
  {
    return $this->children->map(function ($item) {
      return [
        'id' => $item->id,
        'name' => $item->name,
        'description' => $item->description,
        'price' => $item->price,
        'properties' => $item->properties,
        'photo_path' => $item->photo_path,
        'is_available' => $item->is_available,
        'order' => $item->order,
        'tags' => $item->formatTags(),
        'customizations' => $item->formatCustomizations()
      ];
    })->sortBy('order')->values()->toArray();
  }

  protected function formatCustomizations(): array
  {
    return $this->children->map(function ($customization) {
      return [
        'id' => $customization->id,
        'name' => $customization->name,
        'description' => $customization->description,
        'price' => $customization->price,
        'properties' => $customization->properties,
        'photo_path' => $customization->photo_path,
        'is_available' => $customization->is_available,
        'order' => $customization->order,
        'tags' => $customization->formatTags()
      ];
    })->sortBy('order')->values()->toArray();
  }

  public static function getMenuStructure(Collection $entries): array
  {
    return [
      'categories' => $entries->map(function ($category) {
        return [
          'id' => $category['id'],
          'name' => $category['name'],
          'itemCount' => count($category['items']),
          'hasCustomizations' => collect($category['items'])->contains(
            fn($item) => !empty($item['customizations'])
          )
        ];
      }),
      'stats' => [
        'totalCategories' => $entries->count(),
        'totalItems' => $entries->sum(fn($category) => count($category['items'])),
        'totalCustomizations' => $entries->sum(function ($category) {
          return collect($category['items'])->sum(
            fn($item) => count($item['customizations'])
          );
        })
      ]
    ];
  }
}
