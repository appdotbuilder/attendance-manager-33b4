
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Attendance', href: '/attendances' },
];

interface User {
    id: number;
    name: string;
    employee_id: string;
    department?: string;
}

interface Attendance {
    id: number;
    clock_in_time: string;
    clock_out_time?: string;
    notes?: string;
    user: User;
}

interface AttendancesIndexProps extends SharedData {
    attendances: {
        data: Attendance[];
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    users: Array<{ id: number; name: string; employee_id: string; }>;
    filters: {
        user_id?: string;
        date_from?: string;
        date_to?: string;
    };
    [key: string]: unknown;
}

export default function AttendancesIndex() {
    const { attendances, users, filters, auth } = usePage<AttendancesIndexProps>().props;
    const isAdminOrStaff = auth.user.role === 'admin' || auth.user.role === 'staff';

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

    const calculateHours = (attendance: Attendance) => {
        if (!attendance.clock_out_time) return 'Still working';
        
        const clockIn = new Date(attendance.clock_in_time);
        const clockOut = new Date(attendance.clock_out_time);
        const diffMs = clockOut.getTime() - clockIn.getTime();
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    };

    const handleFilter = (key: string, value: string) => {
        const newFilters = { ...filters } as Record<string, string>;
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        
        router.get(route('attendances.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Records" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">📊 Attendance Records</h1>
                        <p className="text-gray-600">
                            {isAdminOrStaff 
                                ? "Monitor and manage employee attendance records" 
                                : "View your attendance history"}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                {isAdminOrStaff && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="user_filter" className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter by User
                                </label>
                                <select
                                    id="user_filter"
                                    value={filters.user_id || ''}
                                    onChange={(e) => handleFilter('user_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Users</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.employee_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 mb-1">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    id="date_from"
                                    value={filters.date_from || ''}
                                    onChange={(e) => handleFilter('date_from', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 mb-1">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    id="date_to"
                                    value={filters.date_to || ''}
                                    onChange={(e) => handleFilter('date_to', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                                    {isAdminOrStaff && (
                                        <th className="text-left py-4 px-6 font-semibold text-gray-900">Employee</th>
                                    )}
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Clock In</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Clock Out</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Hours</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {attendances.data.length > 0 ? (
                                    attendances.data.map((attendance) => (
                                        <tr key={attendance.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6 text-gray-900">
                                                {formatDate(attendance.clock_in_time)}
                                            </td>
                                            {isAdminOrStaff && (
                                                <td className="py-4 px-6">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{attendance.user.name}</div>
                                                        <div className="text-sm text-gray-500">{attendance.user.employee_id}</div>
                                                    </div>
                                                </td>
                                            )}
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {formatTime(attendance.clock_in_time)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {attendance.clock_out_time ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {formatTime(attendance.clock_out_time)}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Still working
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-gray-900">
                                                {calculateHours(attendance)}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {attendance.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdminOrStaff ? 6 : 5} className="py-8 px-6 text-center text-gray-500">
                                            No attendance records found for the selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attendances.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {((attendances.current_page - 1) * attendances.per_page) + 1} to{' '}
                                    {Math.min(attendances.current_page * attendances.per_page, attendances.total)} of{' '}
                                    {attendances.total} results
                                </div>
                                <div className="flex items-center space-x-1">
                                    {attendances.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.visit(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm border rounded ${
                                                link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : link.url
                                                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}