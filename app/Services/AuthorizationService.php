<?php

namespace App\Services;

use App\Models\User;
use App\Models\Attendance;
use App\Models\Schedule;

class AuthorizationService
{
    /**
     * Check if user can manage users.
     *
     * @param User $user
     * @return bool
     */
    public function canManageUsers(User $user): bool
    {
        return $user->isAdmin() || $user->isStaff();
    }

    /**
     * Check if user can view user details.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function canViewUser(User $user, User $targetUser): bool
    {
        return $user->isAdmin() || $user->isStaff() || $user->id === $targetUser->id;
    }

    /**
     * Check if user can update another user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function canUpdateUser(User $user, User $targetUser): bool
    {
        return $user->isAdmin() || ($user->isStaff() && !$targetUser->isAdmin());
    }

    /**
     * Check if user can delete another user.
     *
     * @param User $user
     * @param User $targetUser
     * @return bool
     */
    public function canDeleteUser(User $user, User $targetUser): bool
    {
        return $user->isAdmin() && $user->id !== $targetUser->id;
    }

    /**
     * Check if user can view attendance records.
     *
     * @param User $user
     * @param Attendance|null $attendance
     * @return bool
     */
    public function canViewAttendance(User $user, ?Attendance $attendance = null): bool
    {
        if ($user->isAdmin() || $user->isStaff()) {
            return true;
        }

        if ($attendance && $user->isEmployee()) {
            return $attendance->user_id === $user->id;
        }

        return $user->isEmployee();
    }

    /**
     * Check if user can manage schedules.
     *
     * @param User $user
     * @return bool
     */
    public function canManageSchedules(User $user): bool
    {
        return $user->isAdmin();
    }
}