import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { ClipboardList, Calendar, FileDown } from 'lucide-react'; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import DataTable from '@/Components/Admin/Datatable'; 

export default function Reports({ auth, reports, filters }) {
 
    const [contractStatus, setContractStatus] = useState(filters?.status || 'Status');
    const [claimStatus, setClaimStatus] = useState(filters?.claimStatus || 'Claim Status');
    const [startDate, setStartDate] = useState(filters?.startDate || '');
    const [endDate, setEndDate] = useState(filters?.endDate || '');
    const [perPage, setPerPage] = useState(filters?.perPage || 5);

   
    const applyFilters = (newParams) => {
        const allParams = {
            perPage: perPage,
            status: contractStatus,
            claimStatus: claimStatus,
            startDate: startDate,
            endDate: endDate,
            ...newParams 
        };

        router.get(route('reports.index'), allParams, {
            preserveScroll: true,
            replace: true,
            preserveState: true
        });
    };

    const handleEntriesChange = (e) => {
        const value = e.target.value;
        setPerPage(value);
        applyFilters({ perPage: value, page: 1 });
    };

    const columns = [
        { key: 'policy_number', label: 'Policy Number' },
        { key: 'customer_name', label: 'Customer' },
        { key: 'plan_type', label: 'Plan Type' },
        { key: 'premium', label: 'Premium' },
        { key: 'purchase_date', label: 'Purchase Date' },
        { key: 'status', label: 'Contract Status' },
        { key: 'claim_status', label: 'Claim Status' },        
    ];

    
    const renderStatus = (status) => {
        const styles = {
            active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            expired: 'bg-rose-100 text-rose-700 border-rose-200', 
            canceled: 'bg-amber-100 text-amber-700 border-amber-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
                {status}
            </span>
        );
    };

    const renderClaimStatus = (claimStatus) => {
        const styles = {
            'Claimed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Pending': 'bg-amber-100 text-amber-600 border-amber-200',   
            'Rejected': 'bg-rose-100 text-rose-700 border-rose-200',    
            'No Claim': 'bg-slate-100 text-slate-500 border-slate-200',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[claimStatus] || 'bg-gray-50 text-gray-400'}`}>
                {claimStatus}
            </span>
        );
    };    

    // Excel export logic (အရောင်တွေ အကုန်ပြန်ထည့်ပေးထားတယ်)
    const downloadExcel = async () => {
        const rawData = Array.isArray(reports.data) ? reports.data : [];
        if (rawData.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Insurance Report');

        const headers = [
            "Policy Number", "Customer Name", "NRC", "Phone", "Address", "DOB",
            "Plan", "Premium", "Purchase Date", "Trip Type", "Destination", "Vehicle",
            "Status", "Claim Status", "Claim Amount", "Beneficiary", "Relationship", 
        ];
        
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3B82F6' } };
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        rawData.forEach(r => {
            const rowData = [
                r.policy_number || '-', r.customer_name || '-', r.customer_nrc || '-',
                r.customer_phone || '-', r.customer_address || '-', r.customer_dob || '-',
                r.plan_type || '-', r.premium || '-', r.purchase_date || '-',
                r.trip_type || '-', r.destination || '-', r.vehicle || '-',
                r.status || '-', r.claim_status || '-', r.claim_amount || 0,
                r.beneficiary_name || '-', r.beneficiary_rel || '-'
            ];

            const row = worksheet.addRow(rowData);
            
            // Excel status colors
            const statusCell = row.getCell(13);
            const statusVal = String(r.status).toLowerCase();
            if (statusVal === 'active') {
                statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
                statusCell.font = { color: { argb: '15803D' }, bold: true };
            } else if (statusVal === 'expired') {
                statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
                statusCell.font = { color: { argb: 'B91C1C' }, bold: true };
            } else if (statusVal === 'canceled') {
                statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
                statusCell.font = { color: { argb: 'B45309' }, bold: true };
            }

           const claimCell = row.getCell(14); 
        const claimValue = String(r.claim_status || '').toLowerCase(); 

        if (claimValue === 'claimed') {
            claimCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } };
            claimCell.font = { color: { argb: '15803D' }, bold: true };
        } else if (claimValue === 'pending') {
            claimCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
            claimCell.font = { color: { argb: 'B45309' }, bold: true };
        } else if (claimValue === 'rejected') {
            claimCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
            claimCell.font = { color: { argb: 'B91C1C' }, bold: true };
        } else {
            claimCell.font = { color: { argb: '64748B' } }; 
        }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Insurance_Report.xlsx`);
    };

const displayData = useMemo(() => {
   
    const rawData = reports?.data || []; 
    
    return rawData.map(report => ({
        ...report,
      
        status: renderStatus(report.status),
        claim_status: renderClaimStatus(report.claim_status),
    }));
}, [reports]); 

    const resetFilters = () => {
        setContractStatus('Status');
        setClaimStatus('Claim Status');
        setStartDate('');
        setEndDate('');
        setPerPage(5);
        router.get(route('reports.index'));
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Reports" />
            <div className="p-8 bg-[#F8FAFC] min-h-screen">
                <div className="bg-white rounded-[2rem] shadow-sm border-2 border-blue-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <ClipboardList size={24} />
                                </div>
                                <h1 className="text-2xl font-black text-blue-600 tracking-tight">Reports</h1>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                                <div className="flex items-center gap-3">
                                    <select 
                                        value={contractStatus}
                                        onChange={(e) => { setContractStatus(e.target.value); applyFilters({ status: e.target.value, page: 1 }); }}
                                        className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Status">Status</option>
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="canceled">Canceled</option>
                                    </select>

                                    <select 
                                        value={claimStatus}
                                        onChange={(e) => { setClaimStatus(e.target.value); applyFilters({ claimStatus: e.target.value, page: 1 }); }}
                                        className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Claim Status">Claim Status</option>
                                        <option value="Claimed">Claimed</option>
                                        <option value="Pending">Pending</option>  
                                        <option value="Rejected">Rejected</option> 
                                        <option value="No Claim">No Claim</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2 bg-[#E2E8F0] rounded-xl px-4 py-1.5 border-none">
                                    <Calendar size={18} className="text-slate-500" />
                                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); if(endDate) applyFilters({ startDate: e.target.value, page: 1 }); }} className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase" />
                                    <span className="text-slate-800 font-bold px-1">To</span>
                                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); if(startDate) applyFilters({ endDate: e.target.value, page: 1 }); }} className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase" />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button onClick={downloadExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2">
                                        <FileDown size={18} /> Excel
                                    </button>
                                    <button onClick={resetFilters} className="bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm">
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="reports-datatable-container p-2">
    <DataTable 
        title="Reports"
        columns={columns} 
        data={displayData}
        
        pagination={{
            current_page: reports.current_page,
            last_page: reports.last_page,
            per_page: reports.per_page,
            total: reports.total, 
            onPageChange: (page) => applyFilters({ page }),
            onLimitChange: (limit) => applyFilters({ perPage: limit, page: 1 })
        }}       
        onEntriesChange={(value) => applyFilters({ perPage: value, page: 1 })} 
    />
</div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                .reports-datatable-container .bg-white > div:first-child { display: none !important; }
                .reports-datatable-container table { border: none !important; border-radius: 1.5rem !important; overflow: hidden !important; }
                .reports-datatable-container thead tr { background-color: #D3E3F8 !important; }
                .reports-datatable-container thead th { color: #1e293b !important; font-weight: 900 !important; border-right: 1px solid #bfdbfe !important; }
                .reports-datatable-container tbody td { border-right: 1px solid #f1f5f9 !important; padding: 0.75rem 1.25rem !important; vertical-align: middle !important; }
            `}} />
        </AdminLayout>
    );
}