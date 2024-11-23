<?php

namespace Database\Seeders;

use App\Models\OCRTask;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OCRTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paths = [
            'menu_dom_costa/0.jpg',
            'menu_dom_costa/1.jpg',
            'menu_dom_costa/2.jpg',
            'menu_dom_costa/3.jpg',
            'menu_dom_costa/4.jpg',
            'menu_dom_costa/5.jpg',

        ];

        foreach ($paths as $path) {
            OCRTask::factory()->count(1)->pending($path)->create();
        }
    }
}
