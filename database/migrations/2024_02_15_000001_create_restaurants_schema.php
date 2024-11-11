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
    });

    // Categories table
    Schema::create('categories', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->foreignId('parent_category_id')->nullable()->constrained('categories')->onDelete('set null');
      $table->integer('order')->default(0);
      $table->timestamps();
    });

    // Menu Items table
    Schema::create('menu_items', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->decimal('price', 10, 2);
      $table->foreignId('menu_id')->constrained()->onDelete('cascade');
      $table->foreignId('category_id')->constrained()->onDelete('cascade');
      $table->string('photo_path')->nullable();
      $table->boolean('is_available')->default(true);
      $table->timestamps();
    });

    // Tags table
    Schema::create('tags', function (Blueprint $table) {
      $table->id();
      $table->string('name')->unique();
      $table->text('description')->nullable();
      $table->timestamps();
    });

    // Menu Item Tags pivot table
    Schema::create('menu_item_tag', function (Blueprint $table) {
      $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
      $table->foreignId('tag_id')->constrained()->onDelete('cascade');
      $table->primary(['menu_item_id', 'tag_id']);
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

    // Order Items table
    Schema::create('order_items', function (Blueprint $table) {
      $table->id();
      $table->foreignId('order_id')->constrained()->onDelete('cascade');
      $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
      $table->integer('quantity')->default(1);
      $table->decimal('total_price', 10, 2);
      $table->text('special_instructions')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    // Drop tables in reverse order of creation
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('orders');
    Schema::dropIfExists('collaborators');
    Schema::dropIfExists('menu_item_tag');
    Schema::dropIfExists('tags');
    Schema::dropIfExists('menu_items');
    Schema::dropIfExists('categories');
    Schema::dropIfExists('menus');
    Schema::dropIfExists('restaurants');
    Schema::dropIfExists('user_settings');
  }
};
