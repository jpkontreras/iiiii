<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('Onboarding/Index');
    }

    public function handle(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|unique:posts|max:255',
            'body' => 'required',
        ]);

        return response()->json(['ok' => true]);
    }
}
