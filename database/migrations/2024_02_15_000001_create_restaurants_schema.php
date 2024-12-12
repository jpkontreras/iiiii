<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('user_settings', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
      $table->json('preferences')->nullable();
      $table->timestamps();
    });

    Schema::create('restaurants', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->string('logo_path')->nullable();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->timestamps();
      $table->unique(['user_id', 'name']);
    });

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

    Schema::create('categories', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('slug');
      $table->text('description')->nullable();
      $table->foreignId('menu_id')->constrained()->onDelete('cascade');
      $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('cascade');
      $table->integer('sort_order')->default(0);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->unique(['menu_id', 'slug']);
      $table->unique(['menu_id', 'name', 'parent_id']);
    });

    Schema::create('menu_items', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('slug');
      $table->text('description')->nullable();
      $table->decimal('base_price', 10, 2);
      $table->string('image_path')->nullable();
      $table->foreignId('menu_id')->constrained()->onDelete('cascade');
      $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->unique(['menu_id', 'slug']);
    });

    Schema::create('item_variations', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
      $table->decimal('price_adjustment', 10, 2)->default(0);
      $table->boolean('is_default')->default(false);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->unique(['menu_item_id', 'name']);
    });

    Schema::create('modifier_groups', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->foreignId('menu_id')->constrained()->onDelete('cascade');
      $table->integer('min_selections')->default(0);
      $table->integer('max_selections')->default(1);
      $table->boolean('is_required')->default(false);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->unique(['menu_id', 'name']);
    });

    Schema::create('modifiers', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->foreignId('modifier_group_id')->constrained()->onDelete('cascade');
      $table->decimal('price_adjustment', 10, 2)->default(0);
      $table->boolean('is_default')->default(false);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->unique(['modifier_group_id', 'name']);
    });

    Schema::create('menu_item_modifier_groups', function (Blueprint $table) {
      $table->id();
      $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
      $table->foreignId('modifier_group_id')->constrained()->onDelete('cascade');
      $table->integer('min_selections')->nullable();
      $table->integer('max_selections')->nullable();
      $table->boolean('is_required')->nullable();
      $table->timestamps();
      $table->unique(['menu_item_id', 'modifier_group_id']);
    });

    Schema::create('collaborators', function (Blueprint $table) {
      $table->id();
      $table->foreignId('user_id')->constrained()->onDelete('cascade');
      $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
      $table->string('role')->default('viewer');
      $table->timestamps();
      $table->unique(['user_id', 'restaurant_id']);
    });

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

    Schema::create('order_items', function (Blueprint $table) {
      $table->id();
      $table->foreignId('order_id')->constrained()->onDelete('cascade');
      $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
      $table->foreignId('item_variation_id')->nullable()->constrained()->onDelete('set null');
      $table->integer('quantity')->default(1);
      $table->decimal('unit_price', 10, 2);
      $table->decimal('total_price', 10, 2);
      $table->text('special_instructions')->nullable();
      $table->timestamps();
    });

    Schema::create('order_item_modifiers', function (Blueprint $table) {
      $table->id();
      $table->foreignId('order_item_id')->constrained()->onDelete('cascade');
      $table->foreignId('modifier_id')->constrained()->onDelete('cascade');
      $table->integer('quantity')->default(1);
      $table->decimal('unit_price', 10, 2);
      $table->decimal('total_price', 10, 2);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('order_item_modifiers');
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
    Schema::dropIfExists('collaborators');
    Schema::dropIfExists('menu_item_modifier_groups');
    Schema::dropIfExists('modifiers');
    Schema::dropIfExists('modifier_groups');
    Schema::dropIfExists('item_variations');
    Schema::dropIfExists('menu_items');
    Schema::dropIfExists('categories');
    Schema::dropIfExists('menus');
    Schema::dropIfExists('restaurants');
    Schema::dropIfExists('user_settings');
  }
};
