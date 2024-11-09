<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Restaurant extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'logo_path',
    'user_id', // owner of the restaurant
  ];

  public function owner(): BelongsTo
  {
    return $this->belongsTo(User::class, 'user_id');
  }

  public function menus(): HasMany
  {
    return $this->hasMany(Menu::class);
  }

  public function collaborators(): HasMany
  {
    return $this->hasMany(Collaborator::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }
}
