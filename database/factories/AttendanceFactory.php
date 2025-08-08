<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $clockInTime = $this->faker->dateTimeBetween('-30 days', 'now');
        $clockOutTime = null;

        // 80% chance of having clocked out
        if ($this->faker->boolean(80)) {
            $clockOutTime = $this->faker->dateTimeBetween($clockInTime, $clockInTime->format('Y-m-d 18:00:00'));
        }

        return [
            'user_id' => User::factory(),
            'clock_in_time' => $clockInTime,
            'clock_out_time' => $clockOutTime,
            'notes' => $this->faker->boolean(30) ? $this->faker->sentence() : null,
        ];
    }

    /**
     * Indicate that the attendance is for today without clock out.
     */
    public function todayActive(): static
    {
        return $this->state(fn (array $attributes) => [
            'clock_in_time' => now()->startOfDay()->addHours(random_int(8, 10)),
            'clock_out_time' => null,
        ]);
    }

    /**
     * Indicate that the attendance is completed for today.
     */
    public function todayCompleted(): static
    {
        $clockInTime = now()->startOfDay()->addHours(random_int(8, 9));
        
        return $this->state(fn (array $attributes) => [
            'clock_in_time' => $clockInTime,
            'clock_out_time' => $clockInTime->copy()->addHours(random_int(7, 9)),
        ]);
    }
}