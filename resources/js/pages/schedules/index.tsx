import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Schedules', href: '/schedules' },
];

interface Schedule {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    working_days: number[];
    is_active: boolean;
    created_at: string;
}

interface SchedulesIndexProps extends SharedData {
    schedules: {
        data: Schedule[];
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
    [key: string]: unknown;
}

export default function SchedulesIndex() {
    const { schedules } = usePage<SchedulesIndexProps>().props;

    const getDayNames = (workingDays: number[]) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return workingDays.map(day => days[day]).join(', ');
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours);
        const ampm = hour24 >= 12 ? 'PM' : 'AM';
        const hour12 = hour24 % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    const handleToggleActive = (schedule: Schedule) => {
        router.patch(route('schedules.update', schedule.id), {
            ...schedule,
            is_active: !schedule.is_active,
        }, {
            preserveState: true,
        });
    };

    const handleDelete = (schedule: Schedule) => {
        if (confirm(`Are you sure you want to delete "${schedule.name}"? This action cannot be undone.`)) {
            router.delete(route('schedules.destroy', schedule.id), {
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule Management" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">⚙️ Schedule Management</h1>
                        <p className="text-gray-600">Configure attendance schedules and working hours</p>
                    </div>
                    <Link href={route('schedules.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            ➕ Create Schedule
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Schedule Name</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Working Hours</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Working Days</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {schedules.data.length > 0 ? (
                                    schedules.data.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div className="font-medium text-gray-900">{schedule.name}</div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-900">
                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                            </td>
                                            <td className="py-4 px-6 text-gray-900">
                                                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {getDayNames(schedule.working_days)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => handleToggleActive(schedule)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        schedule.is_active 
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {schedule.is_active ? '✅ Active' : '⏸️ Inactive'}
                                                </button>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {new Date(schedule.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('schedules.show', schedule.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('schedules.edit', schedule.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                                        onClick={() => handleDelete(schedule)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 px-6 text-center text-gray-500">
                                            No schedules found. <Link href={route('schedules.create')} className="text-blue-600 hover:underline">Create the first schedule</Link>.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {schedules.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {((schedules.current_page - 1) * schedules.per_page) + 1} to{' '}
                                    {Math.min(schedules.current_page * schedules.per_page, schedules.total)} of{' '}
                                    {schedules.total} results
                                </div>
                                <div className="flex items-center space-x-1">
                                    {schedules.links.map((link, index) => (
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