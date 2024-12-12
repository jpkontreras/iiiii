<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class ItemVariation extends Model
{
  protected $fillable = [
    'name',
    'menu_item_id',
    'price_adjustment',
    'is_default',
    'is_active',
  ];

  protected $casts = [
    'price_adjustment' => 'decimal:2',
    'is_default' => 'boolean',
    'is_active' => 'boolean',
  ];

  public function menuItem(): BelongsTo
  {
    return $this->belongsTo(MenuItem::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }
}
