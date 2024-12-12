<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class MenuItem extends Model
{
  protected $fillable = [
    'name',
    'slug',
    'description',
    'base_price',
    'image_path',
    'menu_id',
    'category_id',
    'is_active',
  ];

  protected $casts = [
    'base_price' => 'decimal:2',
    'is_active' => 'boolean',
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function variations(): HasMany
  {
    return $this->hasMany(ItemVariation::class);
  }

  public function modifierGroups(): BelongsToMany
  {
    return $this->belongsToMany(ModifierGroup::class, 'menu_item_modifier_groups');
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }
}
