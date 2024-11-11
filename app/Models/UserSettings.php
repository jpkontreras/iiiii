<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class UserSettings extends Model
{
  protected $fillable = [
    'preferences',
  ];

  protected $casts = [
    'preferences' => 'array',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function hasAcceptedOnboardingAgreement(): bool
  {
    return $this->preferences['onboarding_agreement_accepted'] ?? false;
  }

  public function acceptOnboardingAgreement(): void
  {
    $preferences = $this->preferences ?? [];
    $preferences['onboarding_agreement_accepted'] = true;
    $preferences['onboarding_agreement_accepted_at'] = now()->toISOString();

    $this->update(['preferences' => $preferences]);
  }
}
