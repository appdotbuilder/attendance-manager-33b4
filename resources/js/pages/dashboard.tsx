import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps extends SharedData {
    todayAttendance?: {
        id: number;
        clock_in_time: string;
        clock_out_time?: string;
        notes?: string;
    };
    statistics?: {
        total_employees: number;
        present_today: number;
        late_today: number;
        total_hours_today: number;
    };
    recentAttendances?: Array<{
        id: number;
        clock_in_time: string;
        clock_out_time?: string;
        user: {
            id: number;
            name: string;
            employee_id: string;
        };
    }>;
    personalAttendances?: Array<{
        id: number;
        clock_in_time: string;
        clock_out_time?: string;
        notes?: string;
    }>;
    qrCodeData?: string;
    [key: string]: unknown;
}

export default function Dashboard() {
    const { 
        auth, 
        todayAttendance, 
        statistics, 
        recentAttendances, 
        personalAttendances,
        qrCodeData 
    } = usePage<DashboardProps>().props;

    const user = auth.user;
    const isAdmin = user.role === 'admin';
    const isStaff = user.role === 'staff';
    const isEmployee = user.role === 'employee';

    const handleClockAction = (action: 'clock_in' | 'clock_out') => {
        router.post(route('attendances.store'), {
            qr_data: qrCodeData,
            action: action,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric' 
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        Welcome back, {user.name}! 👋
                    </h1>
                    <p className="text-blue-100">
                        {isAdmin && "You have full system access to manage attendance and users."}
                        {isStaff && "Monitor and manage employee attendance records."}
                        {isEmployee && "Track your attendance and view your history."}
                    </p>
                </div>

                {/* Employee Clock In/Out Section */}
                {isEmployee && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">📱 Quick Actions</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${
                                        todayAttendance && !todayAttendance.clock_out_time 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300'
                                    }`}></div>
                                    <span className="text-sm text-gray-600">
                                        Status: {todayAttendance && !todayAttendance.clock_out_time 
                                            ? 'Clocked In' 
                                            : 'Clocked Out'}
                                    </span>
                                </div>

                                {todayAttendance && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-1">Today's Activity</p>
                                        <p className="font-medium">
                                            Clocked in at {formatTime(todayAttendance.clock_in_time)}
                                        </p>
                                        {todayAttendance.clock_out_time && (
                                            <p className="font-medium">
                                                Clocked out at {formatTime(todayAttendance.clock_out_time)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                {!todayAttendance || todayAttendance.clock_out_time ? (
                                    <Button 
                                        onClick={() => handleClockAction('clock_in')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        size="lg"
                                    >
                                        🕐 Clock In
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={() => handleClockAction('clock_out')}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        size="lg"
                                    >
                                        🕐 Clock Out
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin/Staff Statistics */}
                {(isAdmin || isStaff) && statistics && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">👥</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.total_employees}</p>
                                    <p className="text-sm text-gray-500">Total Employees</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <span className="text-green-600 font-semibold">✅</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.present_today}</p>
                                    <p className="text-sm text-gray-500">Present Today</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <span className="text-yellow-600 font-semibold">⏰</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.late_today}</p>
                                    <p className="text-sm text-gray-500">Late Today</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-purple-600 font-semibold">📊</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{Math.round(statistics.total_hours_today)}</p>
                                    <p className="text-sm text-gray-500">Hours Today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Recent Attendances for Admin/Staff */}
                    {(isAdmin || isStaff) && recentAttendances && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">📋 Today's Activity</h2>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => router.visit(route('attendances.index'))}
                                >
                                    View All
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {recentAttendances.length > 0 ? (
                                    recentAttendances.map((attendance) => (
                                        <div key={attendance.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{attendance.user.name}</p>
                                                <p className="text-sm text-gray-500">{attendance.user.employee_id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    In: {formatTime(attendance.clock_in_time)}
                                                </p>
                                                {attendance.clock_out_time && (
                                                    <p className="text-sm text-gray-500">
                                                        Out: {formatTime(attendance.clock_out_time)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No attendance records today</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Personal Attendance History for Employees */}
                    {isEmployee && personalAttendances && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">📅 Your Recent Activity</h2>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => router.visit(route('attendances.index'))}
                                >
                                    View All
                                </Button>
                            </div>
                            
                            <div className="space-y-3">
                                {personalAttendances.length > 0 ? (
                                    personalAttendances.map((attendance) => (
                                        <div key={attendance.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {formatDate(attendance.clock_in_time)}
                                                </p>
                                                {attendance.notes && (
                                                    <p className="text-sm text-gray-500">{attendance.notes}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    In: {formatTime(attendance.clock_in_time)}
                                                </p>
                                                {attendance.clock_out_time && (
                                                    <p className="text-sm text-gray-500">
                                                        Out: {formatTime(attendance.clock_out_time)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No attendance records yet</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h2>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {(isAdmin || isStaff) && (
                                <>
                                    <Button 
                                        variant="outline" 
                                        className="justify-start h-12"
                                        onClick={() => router.visit(route('users.index'))}
                                    >
                                        <span className="mr-3">👥</span>
                                        Manage Users
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="justify-start h-12"
                                        onClick={() => router.visit(route('attendances.index'))}
                                    >
                                        <span className="mr-3">📊</span>
                                        Attendance Reports
                                    </Button>
                                </>
                            )}
                            
                            {isAdmin && (
                                <Button 
                                    variant="outline" 
                                    className="justify-start h-12"
                                    onClick={() => router.visit(route('schedules.index'))}
                                >
                                    <span className="mr-3">⚙️</span>
                                    Configure Schedules
                                </Button>
                            )}
                            
                            {isEmployee && (
                                <Button 
                                    variant="outline" 
                                    className="justify-start h-12"
                                    onClick={() => router.visit(route('attendances.index'))}
                                >
                                    <span className="mr-3">📅</span>
                                    My Attendance History
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}