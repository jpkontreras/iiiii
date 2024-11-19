<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Menu;
use App\Services\MenuImportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessMenuFiles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly Menu $menu,
        private readonly string $path
    ) {}

    public function handle(MenuImportService $menuImportService): void
    {





        Log::info('Processing menu files for {menu} with {files}', ['menu' => $this->menu->id, 'files' => Storage::files($this->path)]);

        // foreach ($this->files as $file) {
        //     try {
        //         $menuImportService->processFile($this->menu, $file);
        //     } catch (\Exception $e) {
        //         $importErrors[] = "Error processing {$file->getClientOriginalName()}: {$e->getMessage()}";
        //     }
        // }

        // if (!empty($importErrors)) {
        //     // You might want to store these errors in the database or notify the user through other means
        //     // For now, we'll just log them
        //     \Log::warning('Menu file import errors for menu ' . $this->menu->id, $importErrors);
        // }
    }
}
