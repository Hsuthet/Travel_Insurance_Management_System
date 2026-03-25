import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import { Head, router } from '@inertiajs/react';
import { UserPlus } from 'lucide-react'; // Added an icon for the button

export default function UserManagement({ users, auth, filters }) {
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || '',
        perPage: filters.perPage || 10
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get('/admin/users', newFilters, { preserveScroll: true, replace: true });
    };

    const handleEdit = (id) => router.get(`/admin/users/${id}/edit`);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const handleAddNew = () => router.get('/admin/users/create');

    const columns = [
        { label: 'ID', key: 'id' },
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Role', key: 'role' },
        { label: 'Actions', key: 'actions' }, // Action buttons are handled inside DataTable
    ];

    const paginationSettings = {
        current_page: users.current_page,
        last_page: users.last_page,
        per_page: users.per_page,
        onPageChange: (page) => router.get('/admin/users', { ...localFilters, page }),
        onLimitChange: (limit) => handleFilterChange('perPage', limit)
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="User Management" />
            
            <DataTable 
                title="User Management"
                columns={columns} 
                data={users.data} 
                pagination={paginationSettings}
                onEdit={handleEdit}
                onDelete={handleDelete}
                // 🌟 Inject the Add New button here
                renderExtra={
                    auth.user.role === 'superadmin' && (
                        <button 
                            onClick={handleAddNew}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            <UserPlus size={18} />
                            Add New User
                        </button>
                    )
                }
            />
        </AdminLayout>
    );
}