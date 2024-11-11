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
        return $request->user()->settings->hasAcceptedOnboardingAgreement() ?? false;
      });

    // Step 2: Restaurant Information
    Onboard::addStep('onboarding.steps.restaurant.title')
      ->link('/onboarding/restaurant')
      ->cta('onboarding.steps.restaurant.cta')
      ->completeIf(function (User $user) {
        return $user->restaurant()->exists();
      });

    // Step 3: Menu Creation
    Onboard::addStep('onboarding.steps.menus.title')
      ->link('/onboarding/menus')
      ->cta('onboarding.steps.menus.cta')
      ->completeIf(function (User $user) {
        return $user->restaurant?->menus()->exists() ?? false;
      });

    // Step 4: Menu Items (Optional)
    Onboard::addStep('onboarding.steps.menu_items.title')
      ->link('/onboarding/menu-items')
      ->cta('onboarding.steps.menu_items.cta')
      ->completeIf(function (User $user) {
        return $user->restaurant?->menus()->whereHas('menuItems')->exists() ?? false;
      });

    // Step 5: Collaborators (Optional)
    Onboard::addStep('onboarding.steps.collaborators.title')
      ->link('/onboarding/collaborators')
      ->cta('onboarding.steps.collaborators.cta')
      ->completeIf(function (User $user) {
        return $user->restaurant?->collaborators()->exists() ?? false;
      });
  }
}
