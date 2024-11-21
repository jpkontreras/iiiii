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
use Spatie\PdfToImage\Pdf;
use Spatie\PdfToImage\Enums\OutputFormat;

class ProcessPdfMenuFile implements ShouldQueue
{
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

  public function __construct(
    private readonly Menu $menu,
    private readonly string $filePath
  ) {}

  public function handle(): void
  {
    try {
      $fullPath = Storage::path($this->filePath);
      $pdf = new Pdf($fullPath);

      // Get base path without extension
      $basePath = str_replace('.pdf', '', $this->filePath);

      // Convert all pages to images
      $imageFiles = $pdf
        ->format(OutputFormat::Png)
        ->resolution(300) // Higher resolution for better OCR results
        ->saveAllPages(Storage::path(dirname($basePath)));

      // Dispatch image processing job for each generated image
      foreach ($imageFiles as $imagePath) {
        ProcessMenuImage::dispatch(
          $this->menu,
          str_replace(Storage::path(''), '', $imagePath)
        );
      }
    } catch (\Exception $e) {
      Log::error('Failed to process PDF menu file', [
        'menu_id' => $this->menu->id,
        'file' => $this->filePath,
        'error' => $e->getMessage()
      ]);

      throw $e;
    }
  }
}
