<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class OrderItem extends Model
{
  use HasFactory;

  protected $fillable = [
    'order_id',
    'menu_entry_id',
    'quantity',
    'special_instructions',
    'total_price',
  ];

  protected $casts = [
    'quantity' => 'integer',
    'total_price' => 'decimal:2',
  ];

  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }

  public function menuEntry(): BelongsTo
  {
    return $this->belongsTo(MenuEntry::class);
  }
}
