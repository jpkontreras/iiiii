<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class MenuOptionType extends Model
{
  protected $fillable = [
    'code',
    'name',
    'is_required',
    'order'
  ];

  protected $casts = [
    'is_required' => 'boolean',
    'order' => 'integer'
  ];

  public function values(): HasMany
  {
    return $this->hasMany(MenuOptionValue::class);
  }
}
