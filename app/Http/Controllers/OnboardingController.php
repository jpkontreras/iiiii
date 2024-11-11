<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

final class OnboardingController extends Controller
{
    public function __invoke(): InertiaResponse
    {
        return Inertia::render('Onboarding/Index');
    }

    public function start(Request $request)
    {
        $user = $request->user();

        // Create settings if they don't exist
        if (!$user->settings) {
            $user->settings()->create(['preferences' => []]);
            $user->refresh();
        }

        // Accept the agreement
        if (!$user->settings->hasAcceptedOnboardingAgreement()) {
            $user->settings->acceptOnboardingAgreement();
        }

        // Redirect to the next step (restaurant info)
        return redirect()->to('/onboarding/restaurant');
    }
}
