<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use App\Models\User;
use Spatie\Onboard\Facades\Onboard;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

        Onboard::addStep('Agree to onboard')
            ->link('/onboarding')
            ->cta('Complete')
            ->completeIf(function (User $model) {
                return false;
            });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
