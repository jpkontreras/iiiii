<?php // routes/breadcrumbs.php

// Note: Laravel will automatically resolve `Breadcrumbs::` without
// this import. This is nice for IDE syntax and refactoring.
use Diglactic\Breadcrumbs\Breadcrumbs;

// This import is also not required, and you could replace `BreadcrumbTrail $trail`
//  with `$trail`. This is nice for IDE type checking and completion.
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Dashboard
Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail) {
  $trail->push('Dashboard', secure_url('dashboard'));
});

// Dashboard > Restaurants
Breadcrumbs::for('restaurants.index', function (BreadcrumbTrail $trail) {
  $trail->parent('dashboard');
  $trail->push('Restaurants', route('restaurants.index'));
});

// Dashboard > Restaurants > Create
Breadcrumbs::for('restaurants.create', function (BreadcrumbTrail $trail) {
  $trail->parent('restaurants.index');
  $trail->push('Create Restaurant', route('restaurants.create'));
});

// Dashboard > Restaurants > [Restaurant]
Breadcrumbs::for('restaurants.show', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.index');
  $trail->push($restaurant->name, route('restaurants.show', $restaurant));
});

// Dashboard > Restaurants > [Restaurant] > Edit
Breadcrumbs::for('restaurants.edit', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.show', $restaurant);
  $trail->push('Edit', route('restaurants.edit', $restaurant));
});

// Dashboard > Restaurants > [Restaurant] > Menus
Breadcrumbs::for('restaurants.menus.index', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.show', $restaurant);
  $trail->push('Menus', route('restaurants.menus.index', $restaurant));
});

// Dashboard > Restaurants > [Restaurant] > Menus > Create
Breadcrumbs::for('restaurants.menus.create', function (BreadcrumbTrail $trail, $restaurant) {
  $trail->parent('restaurants.menus.index', $restaurant);
  $trail->push('Create Menu', route('restaurants.menus.create', $restaurant));
});

// Dashboard > Restaurants > [Restaurant] > Menus > [Menu]
Breadcrumbs::for('restaurants.menus.show', function (BreadcrumbTrail $trail, $restaurant, $menu) {
  $trail->parent('restaurants.menus.index', $restaurant);
  $trail->push($menu->name, route('restaurants.menus.show', [$restaurant, $menu]));
});

// Dashboard > Restaurants > [Restaurant] > Menus > [Menu] > Edit
Breadcrumbs::for('restaurants.menus.edit', function (BreadcrumbTrail $trail, $restaurant, $menu) {
  $trail->parent('restaurants.menus.show', $restaurant, $menu);
  $trail->push('Edit', route('restaurants.menus.edit', [$restaurant, $menu]));
});
