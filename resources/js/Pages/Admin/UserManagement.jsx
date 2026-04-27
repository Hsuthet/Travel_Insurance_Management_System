import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import { Head, router } from '@inertiajs/react';
import { Users, Calendar, ChevronDown, UserPlus, Trash2 } from 'lucide-react';

export default function UserManagement({ users, auth, filters }) {
    const [role, setRole] = useState(filters.role?.toLowerCase() || 'role');
    const [startDate, setStartDate] = useState(filters.startDate || '');
    const [endDate, setEndDate] = useState(filters.endDate || '');

    const isFirstRender = useRef(true);

    const handleDelete = (id) => {
        if (id === auth.user.id) {
            alert("You cannot delete your own account.");
            return;
        }

        if (confirm('Are you sure you want to delete this user? This action is permanent.')) {
            router.delete(`/admin/users/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success handling usually handled by flash messages in AdminLayout
                }
            });
        }
    };

    const renderRoleBadge = (role) => {
        const key = role ? String(role).toLowerCase() : 'user';
        const styles = {
            'superadmin': 'bg-purple-100 text-purple-700 border-purple-200',
            'admin': 'bg-blue-100 text-blue-700 border-blue-200',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${styles[key] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {key}
            </span>
        );
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const queryParams = {};
        if (role !== 'role') queryParams.role = role.toLowerCase();
        if (startDate) queryParams.startDate = startDate;
        if (endDate) queryParams.endDate = endDate;

        const delayDebounceFn = setTimeout(() => {
            router.get('/admin/users', queryParams, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
                only: ['users', 'filters']
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [role, startDate, endDate]);

    const resetFilters = () => {
        setRole('role');
        setStartDate('');
        setEndDate('');
        router.get('/admin/users', {}, { replace: true, preserveScroll: true });
    };

    const columns = [
        {
            label: 'No',
            key: 'id',
            render: (row, index) => (users.current_page - 1) * users.per_page + (index + 1)
        },
        { label: 'Name', key: 'name', render: (row) => <span className="font-bold text-slate-700">{row.name}</span> },
        { label: 'Email', key: 'email' },
        {
            label: 'Role',
            key: 'role',
            render: (row) => <div className="flex justify-center">{renderRoleBadge(row.role)}</div>
        },
        {
            label: 'Joined Date',
            key: 'created_at',
            render: (row) => row.created_at ? new Date(row.created_at).toLocaleDateString('ja-JP') : '-'
        },
        {
            label: 'Action',
            key: 'actions',
            render: (row) => (
                <div className="flex justify-start items-center gap-2">
                    <button
                        onClick={() => router.get(`/admin/users/${row.id}/edit`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all uppercase"
                    >
                        Edit
                    </button>
                    {row.id !== auth.user.id && (
                        <button
                            onClick={() => handleDelete(row.id)}
                            className="bg-rose-100 hover:bg-rose-600 text-rose-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all uppercase flex items-center gap-1"
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="User Management" />

            <DataTable
                columns={columns}
                title="User Management"
                icon={Users}
                data={users.data}
                pagination={{
                    current_page: users.current_page,
                    last_page: users.last_page,
                    per_page: users.per_page,
                    onPageChange: (page) => {
                        router.get(route('admin.users.index'), {
                            page: page,
                            per_page: users.per_page,
                            role: role !== 'role' ? role : null,
                            startDate: startDate || null,
                            endDate: endDate || null
                        }, { preserveState: true, preserveScroll: true })
                    },
                    onLimitChange: (limit) => {
                        router.get(route('admin.users.index'), {
                            page: 1,
                            per_page: limit,
                            role: role !== 'role' ? role : null,
                            startDate: startDate || null,
                            endDate: endDate || null
                        }, { preserveState: true, preserveScroll: true })
                    }
                }}
                renderExtra={
                    <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="role">Role</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="flex items-center gap-2 bg-[#E2E8F0] rounded-xl px-4 py-1.5 border-none">
                            <Calendar size={18} className="text-slate-500" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase"
                            />
                            <span className="text-slate-800 font-bold px-1">To</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase"
                            />
                        </div>

                        <button
                            onClick={resetFilters}
                            className="bg-[#D3E3F8] hover:bg-blue-200 text-blue-600 font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                        >
                            Clear
                        </button>

                        {auth.user.role === 'superadmin' && (
                            <button
                                onClick={() => router.get('/admin/users/create')}
                                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase"
                            >
                                <UserPlus size={18} />
                                Add User
                            </button>
                        )}
                    </div>
                }
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                .user-datatable-container .bg-white > div:first-child { display: none !important; }
                .user-datatable-container table { border: none !important; border-radius: 1.5rem !important; overflow: hidden !important; }
                .user-datatable-container thead tr { background-color: #D3E3F8 !important; }
                .user-datatable-container thead th { color: #1e293b !important; font-weight: 900 !important; border-right: 1px solid #bfdbfe !important; text-transform: uppercase; font-size: 12px; height: 50px; }
                .user-datatable-container tbody td { border-right: 1px solid #f1f5f9 !important; padding: 1rem 1.25rem !important; vertical-align: middle !important; color: #475569; }
                .user-datatable-container tbody tr:hover { background-color: #f8fafc !important; }
            `}} />
        </AdminLayout>
    );
}