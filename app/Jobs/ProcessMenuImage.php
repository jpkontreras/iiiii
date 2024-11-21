<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Menu;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessMenuImage implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public function __construct(
    private readonly Menu $menu,
    private readonly string $imagePath
  ) {}

  public function handle(): void
  {
    try {
      Log::info('Processing menu image', [
        'menu_id' => $this->menu->id,
        'image' => $this->imagePath
      ]);

      // Here you can implement image processing logic
      // For example:
      // - OCR processing
      // - Image analysis
      // - Menu item extraction
      // - etc.

    } catch (\Exception $e) {
      Log::error('Failed to process menu image', [
        'menu_id' => $this->menu->id,
        'image' => $this->imagePath,
        'error' => $e->getMessage()
      ]);

      throw $e;
    }
  }
}
