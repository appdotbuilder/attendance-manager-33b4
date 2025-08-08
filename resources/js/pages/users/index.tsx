import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    employee_id?: string;
    department?: string;
    created_at: string;
}

interface UsersIndexProps extends SharedData {
    users: {
        data: User[];
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

export default function UsersIndex() {
    const { users } = usePage<UsersIndexProps>().props;

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'staff': return 'bg-blue-100 text-blue-800';
            case 'employee': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            router.delete(route('users.destroy', user.id), {
                preserveState: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">👥 User Management</h1>
                        <p className="text-gray-600">Manage system users and their roles</p>
                    </div>
                    <Link href={route('users.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            ➕ Add User
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Employee ID</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
                                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                                    <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-900">
                                                {user.employee_id || '-'}
                                            </td>
                                            <td className="py-4 px-6 text-gray-900">
                                                {user.department || '-'}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={route('users.show', user.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('users.edit', user.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50 hover:border-red-200"
                                                        onClick={() => handleDelete(user)}
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
                                            No users found. <Link href={route('users.create')} className="text-blue-600 hover:underline">Create the first user</Link>.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {((users.current_page - 1) * users.per_page) + 1} to{' '}
                                    {Math.min(users.current_page * users.per_page, users.total)} of{' '}
                                    {users.total} results
                                </div>
                                <div className="flex items-center space-x-1">
                                    {users.links.map((link, index) => (
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