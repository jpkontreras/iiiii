<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class OrderItemModifier extends Model
{
  protected $fillable = [
    'order_item_id',
    'modifier_id',
    'quantity',
    'unit_price',
    'total_price',
  ];

  protected $casts = [
    'quantity' => 'integer',
    'unit_price' => 'decimal:2',
    'total_price' => 'decimal:2',
  ];

  public function orderItem(): BelongsTo
  {
    return $this->belongsTo(OrderItem::class);
  }

  public function modifier(): BelongsTo
  {
    return $this->belongsTo(Modifier::class);
  }
}
