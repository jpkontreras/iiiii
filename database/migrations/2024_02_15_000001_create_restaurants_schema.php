<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    // 1. Base tables without foreign keys
    Schema::create('user_settings', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
      $table->json('preferences')->nullable();
      $table->timestamps();
    });

    Schema::create('tags', function (Blueprint $table) {
      $table->id();
      $table->string('name')->unique();
      $table->string('type')->nullable();
      $table->timestamps();
    });

    // 2. Restaurant table
    Schema::create('restaurants', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->string('logo_path')->nullable();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->timestamps();
      $table->unique(['user_id', 'name']);
    });

    // 3. Menu table depends on restaurants
    Schema::create('menus', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
      $table->string('template_type')->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->unique(['restaurant_id', 'name']);
    });

    // 4. Menu option types (base table for options)
    Schema::create('menu_option_types', function (Blueprint $table) {
      $table->id();
      $table->string('code')->unique();
      $table->string('name');
      $table->boolean('is_required')->default(false);
      $table->integer('order')->default(0);
      $table->timestamps();
    });

    // 5. Menu option values depends on types
    Schema::create('menu_option_values', function (Blueprint $table) {
      $table->id();
      $table->foreignId('menu_option_type_id')->constrained()->onDelete('cascade');
      $table->string('code')->unique();
      $table->string('name');
      $table->decimal('price_adjustment', 10, 2)->default(0);
      $table->integer('order')->default(0);
      $table->timestamps();
    });

    // 6. Menu entries with path-based hierarchy
    Schema::create('menu_entries', function (Blueprint $table) {
      $table->id();
      $table->string('path');
      $table->string('name');
      $table->text('description')->nullable();
      $table->decimal('price', 10, 2)->nullable();
      $table->foreignId('menu_id')->constrained()->onDelete('cascade');
      $table->float('position', 8, 2)->default(0);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->index('path');
    });

    // 7. Option rules depend on types
    Schema::create('menu_option_rules', function (Blueprint $table) {
      $table->id();
      $table->foreignId('menu_option_type_id')->constrained()->onDelete('cascade');
      $table->json('allowed_combinations');
      $table->json('restrictions');
      $table->timestamps();
    });

    // 8. Menu entry options linking table
    Schema::create('menu_entry_options', function (Blueprint $table) {
      $table->id();
      $table->foreignId('menu_entry_id')->constrained()->onDelete('cascade');
      $table->foreignId('menu_option_type_id')->constrained()->onDelete('cascade');
      $table->boolean('is_required')->default(false);
      $table->integer('order')->default(0);
      $table->timestamps();
      $table->unique(['menu_entry_id', 'menu_option_type_id']);
    });

    // 9. Menu entry tags pivot table
    Schema::create('menu_entry_tag', function (Blueprint $table) {
      $table->foreignId('menu_entry_id')->constrained()->onDelete('cascade');
      $table->foreignId('tag_id')->constrained()->onDelete('cascade');
      $table->primary(['menu_entry_id', 'tag_id']);
    });

    // 10. Collaborators table
    Schema::create('collaborators', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
      $table->string('role')->default('viewer');
      $table->timestamps();
      $table->unique(['user_id', 'restaurant_id']);
    });

    // 11. Orders table
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

    // 12. Order items table
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
    // Drop tables in reverse order of creation to respect foreign key constraints
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
    Schema::dropIfExists('collaborators');
    Schema::dropIfExists('menu_entry_tag');
    Schema::dropIfExists('menu_entry_options');
    Schema::dropIfExists('menu_option_rules');
    Schema::dropIfExists('menu_entries');
    Schema::dropIfExists('menu_option_values');
    Schema::dropIfExists('menu_option_types');
    Schema::dropIfExists('menus');
    Schema::dropIfExists('restaurants');
    Schema::dropIfExists('tags');
    Schema::dropIfExists('user_settings');
  }
};
