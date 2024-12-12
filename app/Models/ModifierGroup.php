<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class ModifierGroup extends Model
{
  protected $fillable = [
    'name',
    'menu_id',
    'min_selections',
    'max_selections',
    'is_required',
  ];

  protected $casts = [
    'min_selections' => 'integer',
    'max_selections' => 'integer',
    'is_required' => 'boolean',
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function modifiers(): HasMany
  {
    return $this->hasMany(Modifier::class);
  }

  public function menuItems(): BelongsToMany
  {
    return $this->belongsToMany(MenuItem::class, 'menu_item_modifier_groups');
  }
}
