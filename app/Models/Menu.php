<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Menu extends Model
{
  protected $fillable = [
    'name',
    'description',
    'restaurant_id',
    'template_type',
    'is_active',
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];

  public function restaurant(): BelongsTo
  {
    return $this->belongsTo(Restaurant::class);
  }

  public function categories(): HasMany
  {
    return $this->hasMany(Category::class);
  }

  public function menuItems(): HasMany
  {
    return $this->hasMany(MenuItem::class);
  }

  public function modifierGroups(): HasMany
  {
    return $this->hasMany(ModifierGroup::class);
  }
}
