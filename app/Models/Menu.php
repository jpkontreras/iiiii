<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Menu extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'restaurant_id',
    'is_active',
    'template_type', // predefined or custom
  ];

  protected $casts = [
    'is_active' => 'boolean',
  ];

  public function restaurant(): BelongsTo
  {
    return $this->belongsTo(Restaurant::class);
  }

  public function menuItems(): HasMany
  {
    return $this->hasMany(MenuItem::class);
  }
}
