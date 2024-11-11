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

    public function start(Request $request): InertiaResponse
    {
        $user = $request->user();
        dd($user->settings);
        if (!$user->settings?->hasAcceptedOnboardingAgreement()) {
            $user->settings->acceptOnboardingAgreement();
        }

        return Inertia::location('/onboarding/restaurant');
    }
}
