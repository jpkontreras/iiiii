<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Collaborator extends Model
{
  use HasFactory;

  // Enum-like constants for role types
  public const ROLE_CREATOR = 'creator';
  public const ROLE_EDITOR = 'editor';
  public const ROLE_VIEWER = 'viewer';

  protected $fillable = [
    'user_id',
    'restaurant_id',
    'role',
  ];

  protected $casts = [
    'role' => 'string',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function restaurant(): BelongsTo
  {
    return $this->belongsTo(Restaurant::class);
  }

  // Check if the collaborator has a specific role
  public function hasRole(string $role): bool
  {
    return $this->role === $role;
  }

  // Convenience methods for role checking
  public function isCreator(): bool
  {
    return $this->hasRole(self::ROLE_CREATOR);
  }

  public function isEditor(): bool
  {
    return $this->hasRole(self::ROLE_EDITOR);
  }

  public function isViewer(): bool
  {
    return $this->hasRole(self::ROLE_VIEWER);
  }
}
