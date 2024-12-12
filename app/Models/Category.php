<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Category extends Model
{
  protected $fillable = [
    'name',
    'slug',
    'description',
    'menu_id',
    'parent_id',
    'sort_order',
    'is_active',
  ];

  protected $casts = [
    'is_active' => 'boolean',
    'sort_order' => 'integer',
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function parent(): BelongsTo
  {
    return $this->belongsTo(Category::class, 'parent_id');
  }

  public function children(): HasMany
  {
    return $this->hasMany(Category::class, 'parent_id');
  }

  public function menuItems(): HasMany
  {
    return $this->hasMany(MenuItem::class);
  }
}
