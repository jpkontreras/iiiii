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
    Schema::dropIfExists('menus');
    Schema::dropIfExists('restaurants');
    Schema::dropIfExists('user_settings');
  }
};
