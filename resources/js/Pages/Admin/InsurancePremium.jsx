import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { CircleDollarSign, Calendar } from 'lucide-react';
import DataTable from '@/Components/Admin/Datatable';

export default function InsurancePremium({ auth, premiums, filters }) {

    const [status, setStatus] = useState(filters?.status || 'Status');
    const [startDate, setStartDate] = useState(filters?.startDate || '');
    const [endDate, setEndDate] = useState(filters?.endDate || '');

    const applyFilters = (newParams) => {
        const allParams = {
            status: status,
            startDate: startDate,
            endDate: endDate,
            ...newParams
        };

        router.get(route('admin.premium'), allParams, {
            preserveScroll: true,
            replace: true,
            preserveState: true
        });
    };

    const resetFilters = () => {
        setStatus('Status');
        setStartDate('');
        setEndDate('');
        router.get(route('admin.premium'));
    };

    const columns = [
        { key: 'contract_id', label: 'Contract ID' },
        { key: 'premium_amount', label: 'Premium Amount' },
        { key: 'payment_date', label: 'Payment Date' },
        { key: 'status', label: 'Status' },
    ];

    const displayData = (premiums?.data || []).map(item => ({
        ...item,
        status: (
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border shadow-sm ${
                item.status === 'accepted'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-amber-100 text-amber-700 border-amber-200'
            }`}>
                {item.status.toUpperCase()}
            </span>
        )
    }));

    return (
        <AdminLayout user={auth.user}>
            <Head title="Insurance Premium" />

            <DataTable
                title="Insurance Premium"
                columns={columns}
                icon={CircleDollarSign}
                data={displayData}
                pagination={{
                    current_page: premiums.current_page,
                    last_page: premiums.last_page,
                    per_page: premiums.per_page,
                    total: premiums.total,
                    onPageChange: (page) => applyFilters({ page }),
                    onLimitChange: (perPage) => applyFilters({ perPage, page: 1 })
                }}
                renderExtra={
                    <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                        <select
                            value={status}
                            onChange={(e) => { 
                                setStatus(e.target.value); 
                                applyFilters({ status: e.target.value, page: 1 }); 
                            }}
                            className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Status">Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                        </select>

                        <div className="flex items-center gap-2 bg-[#E2E8F0] rounded-xl px-4 py-1.5 border-none">
                            <Calendar size={18} className="text-slate-500" />
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={e => { 
                                    setStartDate(e.target.value); 
                                    if (endDate) applyFilters({ startDate: e.target.value, page: 1 }); 
                                }} 
                                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase" 
                            />
                            <span className="text-slate-800 font-bold px-1">To</span>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={e => { 
                                    setEndDate(e.target.value); 
                                    if (startDate) applyFilters({ endDate: e.target.value, page: 1 }); 
                                }} 
                                className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase" 
                            />
                        </div>

                        <button 
                            onClick={resetFilters} 
                            className="bg-[#D3E3F8] hover:bg-blue-200 text-blue-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
                        >
                            Clear
                        </button>
                    </div>
                }
            />

            <style dangerouslySetInnerHTML={{ __html: `
                .premium-datatable .bg-white > div:first-child { display: none !important; }
                .premium-datatable thead tr { background-color: #D3E3F8 !important; }
                .premium-datatable thead th { text-align: center !important; font-weight: 900 !important; color: #1e293b !important; border-right: 1px solid #bfdbfe !important; }
                .premium-datatable tbody td { text-align: center !important; border-right: 1px solid #f1f5f9 !important; }
            `}} />
        </AdminLayout>
    );
}