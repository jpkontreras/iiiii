<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class MenuItem extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'price',
    'menu_id',
    'category_id',
    'photo_path',
    'is_available',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'is_available' => 'boolean',
  ];

  public function menu(): BelongsTo
  {
    return $this->belongsTo(Menu::class);
  }

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  public function tags(): BelongsToMany
  {
    return $this->belongsToMany(Tag::class, 'menu_item_tag');
  }
}
