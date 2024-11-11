<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class Onboarding
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $onboardingState = $user->onboarding();

        // Share onboarding state with Inertia
        Inertia::share('onboarding', $onboardingState);

        if ($onboardingState->inProgress()) {
            $nextStep = $onboardingState->nextUnfinishedStep();

            // Only redirect if we're not already on the target route
            if ($request->path() !== ltrim($nextStep->link, '/')) {
                return redirect()->to($nextStep->link);
            }
        }

        return $next($request);
    }
}