<?php

return [
  'welcome' => [
    'title' => 'Bienvenido a IRMA',
    'description' => 'Comencemos configurando el perfil de tu restaurante. Por favor, proporciona el nombre de tu restaurante y una breve descripción.',
  ],
  'form' => [
    'restaurant' => [
      'label' => 'Nombre del Restaurante',
      'placeholder' => 'Ingresa el nombre de tu restaurante',
      'validation' => [
        'min' => 'El nombre del restaurante debe tener al menos 2 caracteres.',
        'max' => 'El nombre del restaurante no debe exceder los 50 caracteres.',
      ],
    ],
    'description' => [
      'label' => 'Descripción',
      'placeholder' => 'Cuéntanos sobre tu restaurante...',
      'validation' => [
        'min' => 'La descripción debe tener al menos 10 caracteres.',
        'max' => 'La descripción no debe exceder los 500 caracteres.',
      ],
      'characters_count' => ':count/500 caracteres',
    ],
    'submit' => [
      'saving' => 'Guardando...',
      'continue' => 'Continuar',
    ],
  ],
  'steps' => [
    'agree' => [
      'title' => 'Aceptar para comenzar',
      'cta' => 'Acepto'
    ],
    'restaurant' => [
      'title' => 'Detalles del Restaurante',
      'cta' => 'Continuar'
    ],
    'menus' => [
      'title' => 'Crear Menús',
      'cta' => 'Continuar'
    ],
    'menu_items' => [
      'title' => 'Agregar Elementos del Menú',
      'cta' => 'Continuar'
    ],
    'collaborators' => [
      'title' => 'Agregar Colaboradores',
      'cta' => 'Completar Configuración'
    ]
  ]
];
