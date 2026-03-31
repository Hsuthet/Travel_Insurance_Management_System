import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import { Head, router } from '@inertiajs/react';
import { List } from 'lucide-react';
import ContractFilter from '@/Components/Admin/ContractFilter';

export default function ContractList({ contracts, auth, filters }) {
    const [values, setValues] = useState({
        status: filters.status || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
    });

    const planNames = { 1: 'Basic', 2: 'Standard', 3: 'Premium' };

    // --- New Render Status Function ---
const renderStatus = (status) => {
    // 1. Normalize input and handle underscores
    let key = status ? status.toLowerCase().replace('_', ' ') : 'default';

    // 2. IMPORTANT: Catch 'rejected' and map it to 'reject' color
    if (key === 'rejected') key = 'reject';

    const styles = {
        'active':   'bg-[#2A7C0E] text-white',
        'expire':   'bg-[#BE201A] text-white',
        'cancel':   'bg-[#D9DC2B] text-black',
        'pending':  'bg-[#DC662B] text-white',
        'wait pay': 'bg-[#007BFF] text-white',
        'reject':   'bg-[#DC2BC7] text-white', 
    };

    const currentStyle = styles[key] || 'bg-slate-500 text-white';

    return (
        <span className={`px-4 py-1 rounded-full text-[12px] font-bold shadow-sm inline-block min-w-[90px] text-center ${currentStyle}`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace('_', ' ') : 'Unknown'}
        </span>
    );
};
    const handleFilterChange = (key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        const cleanValues = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== "" && v !== null)
        );
        router.get(route('admin.contracts.index'), cleanValues, {
            preserveState: true,
            replace: true,
            preserveScroll: true
        });
    }, [values.status, values.startDate, values.endDate]);

    const handleClear = () => {
        setValues({ status: '', startDate: '', endDate: '' });
        router.get(route('admin.contracts.index'));
    };

    const columns = [
        { label: 'Contract ID', key: 'contract_id' },
        { label: 'Policy No', key: 'policy_no', render: (val) => val || '-' },
        { 
            label: 'Customer Name', 
            key: 'customer', 
            render: (customer) => <span className="font-semibold text-slate-700">{customer?.name || 'N/A'}</span>
        },
        { label: 'Plan', key: 'plan_id', render: (id) => planNames[id] || 'Unknown' },
        { 
            label: 'Applied Date', 
            key: 'created_at', 
            render: (date) => date ? new Date(date).toLocaleDateString() : '-' 
        },
        { 
            label: 'Premium Amount', 
            key: 'premium_amount',
            render: (amount) => <span>{amount ? Number(amount).toLocaleString() : '0'}</span>
        },
        { 
            label: 'Status', 
            key: 'status',
      
            render: (val) => (
                <div className="flex justify-center">
                    {renderStatus(val)}
                </div>
            )
        },
        { 
            label: 'Action', 
            key: 'actions_column', 
            render: (_, row) => ( 
                <div className="flex justify-center">
                    <button 
                        onClick={() => router.get(route('admin.contracts.show', row.contract_id || row.id))}
                        className="bg-[#3B82F6] hover:bg-blue-600 text-white px-7 py-1 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95"
                    >
                        View
                    </button>
                </div>
            )
        }
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Contract List" />
            <div className="p-6 space-y-4 max-w-[1450px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2 text-[#3B82F6] font-extrabold text-xl">
                        <List size={24} strokeWidth={3} />
                        Contract List
                    </div>
                    <ContractFilter 
                        values={values}
                        // Passing the keys from our style object to the filter options
                        statusOptions={['Active', 'Expire', 'Cancel', 'Pending', 'Wait pay', 'Reject']}
                        onChange={handleFilterChange}
                        onClear={handleClear}
                    />
                </div>

                <div className="bg-white rounded-[20px] border-[2.5px] border-[#A5C9F3] overflow-hidden shadow-lg p-0.5">
                    <DataTable 
                        columns={columns} 
                        data={contracts.data} 
                        pagination={{
                            current_page: contracts.current_page,
                            last_page: contracts.last_page,
                            onPageChange: (page) => {
                                const cleanValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== ""));
                                router.get(route('admin.contracts.index'), { ...cleanValues, page });
                            }
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}