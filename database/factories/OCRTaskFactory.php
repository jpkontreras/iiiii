<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OCRTask>
 */
class OCRTaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'file_path' => 'uploads/some.jpeg',
            'status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'failed']),
            'result' => $this->faker->randomElement([
                null,
                json_encode([
                    [
                        'text' => $this->faker->sentence,
                        'confidence' => $this->faker->randomFloat(2, 0.7, 1),
                        'coordinates' => [
                            [0, 0],
                            [100, 0],
                            [100, 30],
                            [0, 30]
                        ]
                    ]
                ])
            ]),
            'error' => null,
            'processing_started_at' => $this->faker->optional()->dateTimeThisMonth()
        ];
    }


    public function pending($path): Factory
    {
        return $this->state(function (array $attributes) use ($path) {
            return [
                'file_path' => 'uploads/' . $path,
                'status' => 'pending',
                'result' => null,
                'error' => null,
                'processing_started_at' => null
            ];
        });
    }
}
