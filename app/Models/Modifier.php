<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Modifier extends Model
{
  protected $fillable = [
    'name',
    'modifier_group_id',
    'price_adjustment',
    'is_default',
    'is_active',
  ];

  protected $casts = [
    'price_adjustment' => 'decimal:2',
    'is_default' => 'boolean',
    'is_active' => 'boolean',
  ];

  public function modifierGroup(): BelongsTo
  {
    return $this->belongsTo(ModifierGroup::class);
  }

  public function orderItemModifiers(): HasMany
  {
    return $this->hasMany(OrderItemModifier::class);
  }
}
