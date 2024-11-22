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
            'foto/1.jpg',
            'foto/2.jpg',
            'foto/3.jpg',
            'foto/4.jpg',
            'foto/5.jpg',
            'foto/6.jpg',
            'foto/7.jpg',
            'foto/8.jpg',
            'foto/9.jpg',
        ];

        foreach ($paths as $path) {
            OCRTask::factory()->count(1)->pending($path)->create();
        }
    }
}
