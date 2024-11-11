<?php

return [
  'welcome' => [
    'title' => 'Welcome to IRMA',
    'description' => "Let's start by setting up your restaurant profile. Please provide your restaurant's name and a brief description.",
  ],
  'form' => [
    'restaurant' => [
      'label' => 'Restaurant Name',
      'placeholder' => 'Enter your restaurant name',
      'validation' => [
        'min' => 'Restaurant name must be at least 2 characters.',
        'max' => 'Restaurant name must not exceed 50 characters.',
      ],
    ],
    'description' => [
      'label' => 'Description',
      'placeholder' => 'Tell us about your restaurant...',
      'validation' => [
        'min' => 'Description must be at least 10 characters.',
        'max' => 'Description must not exceed 500 characters.',
      ],
      'characters_count' => ':count/500 characters',
    ],
    'submit' => [
      'saving' => 'Saving...',
      'continue' => 'Continue',
    ],
  ],
  'steps' => [
    'agree' => [
      'title' => 'Agree to onboard',
      'cta' => 'I Agree'
    ],
    'restaurant' => [
      'title' => 'Restaurant Details',
      'cta' => 'Continue'
    ],
    'menus' => [
      'title' => 'Create Menus',
      'cta' => 'Continue'
    ],
    'menu_items' => [
      'title' => 'Add Menu Items',
      'cta' => 'Continue'
    ],
    'collaborators' => [
      'title' => 'Add Collaborators',
      'cta' => 'Complete Setup'
    ]
  ]
];
