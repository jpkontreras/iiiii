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

class ProcessMenuFiles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly Menu $menu,
        private readonly string $path
    ) {}

    public function handle(): void
    {
        $files = Storage::files($this->path);

        foreach ($files as $file) {
            try {
                $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                Log::info('Processing menu file', [
                    'menu_id' => $this->menu->id,
                    'file' => $file,
                    'extension' => $extension
                ]);

                match ($extension) {
                    'pdf' => ProcessPdfMenuFile::dispatch($this->menu, $file),
                        // Add more file type handlers here as needed
                    default => Log::warning('Unsupported file type', [
                        'menu_id' => $this->menu->id,
                        'file' => $file,
                        'extension' => $extension
                    ])
                };
            } catch (\Exception $e) {
                Log::error('Error processing menu file', [
                    'menu_id' => $this->menu->id,
                    'file' => $file,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }
}
