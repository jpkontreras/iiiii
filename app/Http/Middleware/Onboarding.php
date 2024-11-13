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
        // Skip middleware for non-authenticated users
        if (!Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $onboardingState = $user->onboarding();

        // Share onboarding state with Inertia for all requests
        Inertia::share('onboarding', $onboardingState);

        // Only handle redirects for GET requests
        if (!$request->isMethod('GET')) {
            return $next($request);
        }

        // If onboarding is finished, skip onboarding routes
        if ($onboardingState->finished()) {
            $currentPath = $request->path();
            if (str_starts_with($currentPath, 'onboarding')) {
                return redirect()->route('dashboard');
            }
            return $next($request);
        }

        // Handle in-progress onboarding
        if ($onboardingState->inProgress()) {
            $nextStep = $onboardingState->nextUnfinishedStep();
            $targetPath = ltrim($nextStep->link, '/');

            // Only redirect if we're not already on the target route
            if ($request->path() !== $targetPath) {
                return redirect()->to($nextStep->link, 302, [], true);
            }
        }

        return $next($request);
    }
}
