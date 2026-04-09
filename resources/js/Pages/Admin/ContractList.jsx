import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import { Head, router } from '@inertiajs/react';
import { List, Calendar, ChevronDown } from 'lucide-react';

export default function ContractList({ contracts, auth, filters }) {
    
    // 1. Local States for filtering
    const [status, setStatus] = useState(filters.status || 'Status');
    const [startDate, setStartDate] = useState(filters.startDate || '');
    const [endDate, setEndDate] = useState(filters.endDate || '');
    
    // Ref to prevent the first render from triggering a router.get
    const isFirstRender = useRef(true);

    const planNames = { 1: 'Basic', 2: 'Standard', 3: 'Premium' };

    // 2. Status Badge Renderer
    const renderStatus = (val) => {
        const key = val ? val.toLowerCase().replace('_', ' ') : 'default';
        const styles = {
            'active':   'bg-emerald-100 text-emerald-700 border-emerald-200',
            'expire':   'bg-rose-100 text-rose-700 border-rose-200',
            'cancel':   'bg-amber-100 text-amber-700 border-amber-200',
            'pending':  'bg-orange-100 text-orange-700 border-orange-200',
            'wait pay': 'bg-blue-100 text-blue-700 border-blue-200',
            'rejected': 'bg-purple-100 text-purple-700 border-purple-200',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${styles[key] || 'bg-slate-100 text-slate-600'}`}>
                {key}
            </span>
        );
    };

    // 3. Reset Function
    const resetFilters = () => {
        setStatus('Status');
        setStartDate('');
        setEndDate('');
        router.get(route('admin.contracts.index'), {}, { 
            replace: true, 
            preserveScroll: true 
        });
    };

    // 3.5 Filter Trigger (The "Brain" of the filters)
    useEffect(() => {
    // Prevent reload on first component mount
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }

    const queryParams = {};
    
    // Only add to URL if a real filter is picked
    if (status !== 'Status') queryParams.status = status;
    if (startDate) queryParams.startDate = startDate;
    if (endDate) queryParams.endDate = endDate;

    const delayDebounceFn = setTimeout(() => {
        router.get(route('admin.contracts.index'), queryParams, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
            only: ['contracts', 'filters']
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
}, [status, startDate, endDate]);

    // 4. Columns Definition
    const columns = [
        { 
        label: 'No', 
        key: 'id', 
        render: (_, __, index) => {
            // Calculate continuous numbering across pages
            // pagination.current_page starts at 1, per_page is usually 10
            return (contracts.current_page - 1) * contracts.per_page + (index + 1);
        }
    },
        { label: 'Policy No', key: 'policy_no', render: (val) => val || '-' },
        { 
            label: 'Customer', 
            key: 'customer', 
            render: (c) => <span className="font-bold text-slate-700">{c?.name || 'N/A'}</span> 
        },
        { label: 'Plan', key: 'plan_id', render: (id) => planNames[id] || 'Unknown' },
        { 
            label: 'Applied Date', 
            key: 'created_at', 
            render: (date) => date ? new Date(date).toLocaleDateString('ja-JP') : '-' 
        },
        { 
            label: 'Premium', 
            key: 'premium_amount',
            render: (amt) => <span className="font-bold">{Number(amt).toLocaleString()}</span>
        },
        { 
            label: 'Status', 
            key: 'status',
            render: (val) => <div className="flex justify-center">{renderStatus(val)}</div>
        },
        { 
            label: 'Action', 
            key: 'actions', 
            render: (_, row) => (
                <div className="flex justify-center">
                    <button 
                        onClick={() => router.get(route('admin.contracts.show', row.contract_id))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all uppercase"
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
            <div className="p-8 bg-[#F8FAFC] min-h-screen">
                
                {/* Main Content Card */}
                <div className="bg-white rounded-[2rem] shadow-sm border-2 border-blue-100 overflow-hidden">
                    
                    {/* Header & Integrated Filters */}
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <List size={24} />
                                </div>
                                <h1 className="text-2xl font-black text-blue-600 tracking-tight">Contract List</h1>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                                
                                {/* Status Dropdown */}
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Status">Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Wait_pay">Wait Pay</option>
                                        <option value="Expire">Expire</option>
                                        <option value="Cancel">Cancel</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Date Range Picker */}
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
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="contract-datatable-container p-2">
                        <DataTable 
                            columns={columns} 
                            data={contracts.data} 
                            pagination={contracts}
                        />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .contract-datatable-container .bg-white > div:first-child { display: none !important; }
                .contract-datatable-container table { border: none !important; border-radius: 1.5rem !important; overflow: hidden !important; }
                .contract-datatable-container thead tr { background-color: #D3E3F8 !important; }
                .contract-datatable-container thead th { color: #1e293b !important; font-weight: 900 !important; border-right: 1px solid #bfdbfe !important; text-transform: uppercase; font-size: 12px; }
                .contract-datatable-container tbody td { border-right: 1px solid #f1f5f9 !important; padding: 1rem 1.25rem !important; vertical-align: middle !important; color: #475569; }
                .contract-datatable-container tbody tr:hover { background-color: #f8fafc !important; }
            `}} />
        </AdminLayout>
    );
}