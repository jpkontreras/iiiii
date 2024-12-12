<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class OrderItem extends Model
{
  protected $fillable = [
    'order_id',
    'menu_item_id',
    'item_variation_id',
    'quantity',
    'unit_price',
    'total_price',
    'special_instructions',
  ];

  protected $casts = [
    'quantity' => 'integer',
    'unit_price' => 'decimal:2',
    'total_price' => 'decimal:2',
  ];

  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }

  public function menuItem(): BelongsTo
  {
    return $this->belongsTo(MenuItem::class);
  }

  public function itemVariation(): BelongsTo
  {
    return $this->belongsTo(ItemVariation::class);
  }

  public function modifiers(): HasMany
  {
    return $this->hasMany(OrderItemModifier::class);
  }
}
