<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Menu;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessMenuItems implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly Menu $menu,
        private readonly array $items
    ) {}

    public function handle(): void
    {
        foreach ($this->items as $itemData) {
            $item = $this->menu->menuItems()->create([
                'name' => $itemData['name'],
                'description' => $itemData['description'] ?? null,
                'price' => $itemData['price'],
                'category_id' => $itemData['category_id'] ?? null,
                'is_available' => $itemData['is_available'] ?? true,
            ]);

            if (isset($itemData['tags']) && is_array($itemData['tags'])) {
                $item->tags()->attach($itemData['tags']);
            }
        }
    }
} 