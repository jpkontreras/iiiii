<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Category extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'menu_id',
    'parent_category_id', // for subcategories
    'order', // for custom sorting
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function menuItems(): HasMany
  {
    return $this->hasMany(MenuItem::class);
  }

  public function parentCategory(): BelongsTo
  {
    return $this->belongsTo(self::class, 'parent_category_id');
  }

  public function subCategories(): HasMany
  {
    return $this->hasMany(self::class, 'parent_category_id');
  }
}
