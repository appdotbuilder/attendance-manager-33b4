<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@attendance.com',
            'department' => 'Administration',
        ]);

        // Create staff users
        $staff = User::factory()->staff()->count(2)->create();

        // Create employee users
        $employees = User::factory()->employee()->count(20)->create();

        // Create default schedule
        Schedule::factory()->standardOfficeHours()->create();

        // Create additional schedules
        Schedule::factory()->count(3)->create();

        // Create attendance records for the last 30 days
        $allUsers = User::where('role', 'employee')->get();
        
        foreach ($allUsers as $user) {
            // Create some historical attendance records
            Attendance::factory()->count(random_int(15, 25))->create([
                'user_id' => $user->id,
            ]);

            // 70% chance of having today's attendance
            if (random_int(1, 10) <= 7) {
                if (random_int(1, 10) <= 6) {
                    // 60% chance of completed attendance
                    Attendance::factory()->todayCompleted()->create([
                        'user_id' => $user->id,
                    ]);
                } else {
                    // 10% chance of active (not clocked out) attendance
                    Attendance::factory()->todayActive()->create([
                        'user_id' => $user->id,
                    ]);
                }
            }
        }
    }
}