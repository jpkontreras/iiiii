<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // User Settings table
    Schema::create('user_settings', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
      $table->json('preferences')->nullable();
      $table->timestamps();
    });

    // Restaurants table
    Schema::create('restaurants', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->string('logo_path')->nullable();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->timestamps();

      // Add unique constraint for name within each user's restaurants
      $table->unique(['user_id', 'name']);
    });

    // Menus table
    Schema::create('menus', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
      $table->string('template_type')->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();

      // Add unique constraint for name within each restaurant
      $table->unique(['restaurant_id', 'name']);
    });

    // Menu Entries table - replaces both categories and menu_items tables
    Schema::create('menu_entries', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->decimal('price', 10, 2)->nullable();
      $table->foreignId('menu_id')->constrained()->onDelete('cascade');
      $table->foreignId('parent_id')->nullable()->constrained('menu_entries')->onDelete('cascade');
      $table->json('properties')->nullable();
      $table->string('photo_path')->nullable();
      $table->boolean('is_available')->default(true);
      $table->integer('order')->default(0);
      $table->timestamps();
    });

    // Tags table
    Schema::create('tags', function (Blueprint $table) {
      $table->id();
      $table->string('name')->unique();
      $table->string('type')->nullable();  // dietary, spice_level, allergen, etc.
      $table->timestamps();
    });

    // Menu Entry Tags pivot table
    Schema::create('menu_entry_tag', function (Blueprint $table) {
      $table->foreignId('menu_entry_id')->constrained()->onDelete('cascade');
      $table->foreignId('tag_id')->constrained()->onDelete('cascade');
      $table->primary(['menu_entry_id', 'tag_id']);
    });

    // Collaborators table
    Schema::create('collaborators', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
      $table->string('role')->default('viewer');
      $table->timestamps();

      // Ensure unique combination of user and restaurant
      $table->unique(['user_id', 'restaurant_id']);
    });

    // Orders table
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
      $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
      $table->string('table_number')->nullable();
      $table->decimal('total_price', 10, 2)->default(0);
      $table->string('status')->default('pending');
      $table->text('special_instructions')->nullable();
      $table->timestamps();
    });

    // Order Items table - updated to reference menu_entries
    Schema::create('order_items', function (Blueprint $table) {
      $table->id();
      $table->foreignId('order_id')->constrained()->onDelete('cascade');
      $table->foreignId('menu_entry_id')->constrained()->onDelete('cascade');
      $table->integer('quantity')->default(1);
      $table->decimal('total_price', 10, 2);
      $table->text('special_instructions')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    // Drop tables in correct order to handle dependencies
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
    Schema::dropIfExists('collaborators');
    Schema::dropIfExists('menu_entry_tag');  // Drop pivot table before tags and menu_entries
    Schema::dropIfExists('menu_item_tag');   // Drop old pivot table if it exists
    Schema::dropIfExists('tags');
    Schema::dropIfExists('menu_entries');
    Schema::dropIfExists('menu_items');      // Drop old table if it exists
    Schema::dropIfExists('categories');      // Drop old table if it exists
    Schema::dropIfExists('menus');
    Schema::dropIfExists('restaurants');
    Schema::dropIfExists('user_settings');
  }
};
