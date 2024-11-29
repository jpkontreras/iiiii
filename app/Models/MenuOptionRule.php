<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class MenuOptionRule extends Model
{
  protected $fillable = [
    'menu_option_type_id',
    'allowed_combinations',
    'restrictions'
  ];

  protected $casts = [
    'allowed_combinations' => 'array',
    'restrictions' => 'array'
  ];

  public function optionType(): BelongsTo
  {
    return $this->belongsTo(MenuOptionType::class, 'menu_option_type_id');
  }
}
