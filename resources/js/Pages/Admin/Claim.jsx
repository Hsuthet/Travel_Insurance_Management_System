import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import { Head, router } from '@inertiajs/react';
import { PlusCircle, ShieldCheck, Edit2 } from 'lucide-react';

export default function Claim({ claims, auth, filters }) {
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || '',
        perPage: filters?.perPage || 10
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        router.get('/admin/claims', newFilters, {
            preserveScroll: true,
            replace: true
        });
    };

    const handleEdit = (claim_id) => {
        router.get(route('admin.claims.edit', claim_id));
    };

    const handleAddNew = () => {
        router.get(route('admin.claims.create'));
    };

    const columns = [
        { label: 'Claim No', key: 'claim_id' },
        { label: 'Policy No', key: 'policy_no' },
        { label: 'Benefit', key: 'benefit_id' },
        { label: 'Claimed Amount', key: 'claim_amount' },
        {
            label: 'Status',
            key: 'status',
            render: (row) => {
                const statusStyles = {
                    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
                    claimed: 'bg-green-100 text-green-700 border-green-200',
                    rejected: 'bg-red-100 text-red-700 border-red-200'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusStyles[row.status] || 'bg-gray-100 text-gray-600'}`}>
                        {row.status}
                    </span>
                );
            }
        },
        {
            label: 'Actions',
            key: 'actions',
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.status === 'pending' ? (
                        <button
                            onClick={() => handleEdit(row.claim_id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 font-medium text-sm"
                        >
                            <Edit2 size={16} />
                            Edit
                        </button>
                    ) : (
                        <span className="text-slate-400 text-xs italic px-3">Locked</span>
                    )}
                </div>
            )
        },
    ];

    const paginationSettings = {
        current_page: claims.current_page,
        last_page: claims.last_page,
        per_page: claims.per_page,
        onPageChange: (page) => router.get('/admin/claims', { ...localFilters, page }),
        onLimitChange: (limit) => handleFilterChange('perPage', limit)
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Claims & Benefits" />
            <DataTable
                title="Claims & Benefits"
                icon={ShieldCheck}
                columns={columns}
                data={claims.data}
                pagination={paginationSettings}
                renderExtra={
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <PlusCircle size={18} />
                        Add New Claim
                    </button>
                }
            />
        </AdminLayout>
    );
}