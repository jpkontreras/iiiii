<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Order extends Model
{
  use HasFactory;

  // Enum-like constants for order status
  public const STATUS_PENDING = 'pending';
  public const STATUS_PREPARING = 'preparing';
  public const STATUS_READY = 'ready';
  public const STATUS_DELIVERED = 'delivered';
  public const STATUS_CANCELLED = 'cancelled';

  protected $fillable = [
    'restaurant_id',
    'table_number',
    'total_price',
    'status',
    'special_instructions',
    'user_id', // waiter or staff member who created the order
  ];

  protected $casts = [
    'total_price' => 'decimal:2',
    'status' => 'string',
  ];

  public function restaurant(): BelongsTo
  {
    return $this->belongsTo(Restaurant::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  // Check if the order has a specific status
  public function hasStatus(string $status): bool
  {
    return $this->status === $status;
  }

  // Convenience methods for status checking
  public function isPending(): bool
  {
    return $this->hasStatus(self::STATUS_PENDING);
  }

  public function isPreparing(): bool
  {
    return $this->hasStatus(self::STATUS_PREPARING);
  }

  public function isReady(): bool
  {
    return $this->hasStatus(self::STATUS_READY);
  }

  public function isDelivered(): bool
  {
    return $this->hasStatus(self::STATUS_DELIVERED);
  }

  public function isCancelled(): bool
  {
    return $this->hasStatus(self::STATUS_CANCELLED);
  }
}
