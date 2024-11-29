<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MenuOptionValue extends Model
{
  protected $fillable = [
    'menu_option_type_id',
    'code',
    'name',
    'price_adjustment',
    'order'
  ];

  protected $casts = [
    'price_adjustment' => 'decimal:2',
    'order' => 'integer'
  ];

  public function type(): BelongsTo
  {
    return $this->belongsTo(MenuOptionType::class, 'menu_option_type_id');
  }
}
