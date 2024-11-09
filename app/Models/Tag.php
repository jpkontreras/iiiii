<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

final class Tag extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
  ];

  public function menuItems(): BelongsToMany
  {
    return $this->belongsToMany(MenuItem::class, 'menu_item_tag');
  }
}
