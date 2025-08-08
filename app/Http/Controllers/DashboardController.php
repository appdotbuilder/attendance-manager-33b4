<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the attendance dashboard.
     */
    public function index()
    {
        $user = auth()->user();
        $today = Carbon::today();

        // Get today's attendance for current user
        $todayAttendance = null;
        if ($user->isEmployee()) {
            $todayAttendance = Attendance::where('user_id', $user->id)
                ->whereDate('clock_in_time', $today)
                ->first();
        }

        // Admin/Staff statistics
        $statistics = [];
        if ($user->isAdmin() || $user->isStaff()) {
            $statistics = [
                'total_employees' => User::where('role', 'employee')->count(),
                'present_today' => Attendance::whereDate('clock_in_time', $today)
                    ->distinct('user_id')
                    ->count(),
                'late_today' => Attendance::whereDate('clock_in_time', $today)
                    ->whereTime('clock_in_time', '>', '09:00:00')
                    ->count(),
                'total_hours_today' => Attendance::whereDate('clock_in_time', $today)
                    ->whereNotNull('clock_out_time')
                    ->get()
                    ->sum(function ($attendance) {
                        return $attendance->getTotalHours() ?? 0;
                    }),
            ];
        }

        // Recent attendance records for admin/staff
        $recentAttendances = collect();
        if ($user->isAdmin() || $user->isStaff()) {
            $recentAttendances = Attendance::with('user:id,name,employee_id')
                ->whereDate('clock_in_time', $today)
                ->latest('clock_in_time')
                ->take(10)
                ->get();
        }

        // Personal attendance history for employees
        $personalAttendances = collect();
        if ($user->isEmployee()) {
            $personalAttendances = Attendance::where('user_id', $user->id)
                ->latest('clock_in_time')
                ->take(10)
                ->get();
        }

        return Inertia::render('dashboard', [
            'todayAttendance' => $todayAttendance,
            'statistics' => $statistics,
            'recentAttendances' => $recentAttendances,
            'personalAttendances' => $personalAttendances,
            'qrCodeData' => $user->getQrCodeData(),
        ]);
    }
}