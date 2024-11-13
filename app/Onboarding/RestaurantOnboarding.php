<?php

declare(strict_types=1);

namespace App\Onboarding;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Onboard\Facades\Onboard;

final class RestaurantOnboarding
{
  public static function register(): void
  {
    // Step 1: Basic Agreement
    Onboard::addStep('onboarding.steps.agree.title')
      ->link('/onboarding')
      ->cta('onboarding.steps.agree.cta')
      ->completeIf(function (Request $request) {
        return $request->user()->hasAcceptedOnboardingAgreement() ?? false;
      });

    // Step 2: Restaurant Information
    Onboard::addStep('onboarding.steps.restaurant.title')
      ->link('/onboarding/restaurant')
      ->cta('onboarding.steps.restaurant.cta')
      ->completeIf(function (Request $request) {
        return $request->user()->restaurants?->isNotEmpty() || false;
      });
  }
}
