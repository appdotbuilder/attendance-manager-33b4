<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Schedule>
 */
class ScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = $this->faker->time('H:i', '09:00');
        $endTime = $this->faker->time('H:i', '17:30');

        // Common working day combinations
        $workingDaysOptions = [
            [1, 2, 3, 4, 5], // Monday to Friday
            [0, 1, 2, 3, 4, 5], // Sunday to Friday
            [1, 2, 3, 4, 5, 6], // Monday to Saturday
            [0, 1, 2, 3, 4, 5, 6], // All days
        ];

        return [
            'name' => $this->faker->randomElement([
                'Standard Office Hours',
                'Early Shift',
                'Late Shift',
                'Weekend Shift',
                'Flexible Hours'
            ]),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'working_days' => $this->faker->randomElement($workingDaysOptions),
            'is_active' => $this->faker->boolean(80),
        ];
    }

    /**
     * Indicate that the schedule is for standard office hours.
     */
    public function standardOfficeHours(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Standard Office Hours',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'working_days' => [1, 2, 3, 4, 5], // Monday to Friday
            'is_active' => true,
        ]);
    }
}