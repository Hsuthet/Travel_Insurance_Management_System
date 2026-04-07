
import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { ClipboardList, Calendar, FileDown } from 'lucide-react'; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


import DataTable from '@/Components/Admin/Datatable'; 

export default function Reports({ auth, reports, pagination }) {
    const [contractStatus, setContractStatus] = useState('Status');
    const [claimStatus, setClaimStatus] = useState('Claim Status');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
            Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            Expire: 'bg-rose-100 text-rose-700 border-rose-200',
            Cancel: 'bg-amber-100 text-amber-700 border-amber-200',
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
        'No Claim': 'bg-slate-100 text-slate-500 border-slate-200',
    };
    
    return (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${styles[claimStatus] || 'bg-gray-50 text-gray-400'}`}>
            {claimStatus}
        </span>
    );

};

const downloadExcel = async () => {
    if (!filteredReports || filteredReports.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Insurance Report');

    
    const headers = [
        "Policy Number", "Customer Name", "NRC", "Phone", "Address", "DOB",
        "Plan", "Premium", "Purchase Date", "Trip Type", "Destination", "Vehicle",
        "Status", "Claim Status", "Claim Amount", "Beneficiary", "Relationship", "Payment Method"
    ];
    
    const headerRow = worksheet.addRow(headers);

    
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '3B82F6' } // Blue-600
        };
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

   
    filteredReports.forEach(r => {
        const originalReport = reports.find(orig => orig.id === r.id) || r;
        
        const rowData = [
            r.policy_number || '-',
            r.customer_name || '-',
            r.customer_nrc || '-',
            r.customer_phone || '-',
            r.customer_address || '-',
            r.customer_dob || '-',
            r.plan_type || '-',
            r.premium || '-',
            r.purchase_date || '-',
            r.trip_type || '-',
            r.destination || '-',
            r.vehicle || '-',
            originalReport.status || '-',
            originalReport.claim_status || '-',
            r.claim_amount || 0,
            r.beneficiary_name || '-',
            r.beneficiary_rel || '-',
            r.payment_method || '-'
        ];

        const row = worksheet.addRow(rowData);

        
        const statusCell = row.getCell(13); 
        const statusValue = String(originalReport.status).toLowerCase();

        if (statusValue === 'active') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCFCE7' } }; // Light Green
            statusCell.font = { color: { argb: '15803D' }, bold: true };
        } else if (statusValue === 'expire') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } }; // Light Red
            statusCell.font = { color: { argb: 'B91C1C' }, bold: true };
        } else if (statusValue === 'cancel') {
            statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } }; // Light Yellow
            statusCell.font = { color: { argb: 'B45309' }, bold: true };
        }

       
        const claimCell = row.getCell(14); // Column N (Claim Status)
        if (String(originalReport.claim_status).toLowerCase() === 'claimed') {
            claimCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DBEAFE' } }; // Light Blue
            claimCell.font = { color: { argb: '1D4ED8' }, bold: true };
        }
    });

   
    worksheet.columns.forEach(column => {
        column.width = 20;
    });

    
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Insurance_Report_${formattedDate}.xlsx`);
};

    const filteredReports = useMemo(() => {
        const data = Array.isArray(reports) ? reports : [];
        return data.filter(report => {
           
            const matchesStatus = contractStatus === 'Status' || report.status === contractStatus;
            const matchesClaim = claimStatus === 'Claim Status' || report.claim_status === claimStatus;
            
            let matchesDate = true;
            if (startDate && endDate) {
                const pDate = new Date(report.purchase_date.split('-').reverse().join('-'));
                const sDate = new Date(startDate);
                const eDate = new Date(endDate);
                matchesDate = pDate >= sDate && pDate <= eDate;
            }
            return matchesStatus && matchesClaim && matchesDate;
        }).map(report => ({
            ...report,
            status: renderStatus(report.status),
            claim_status: renderClaimStatus(report.claim_status),
           
        }));
    }, [contractStatus, claimStatus, startDate, endDate, reports]); 
    const resetFilters = () => {
        setContractStatus('Status');
        setClaimStatus('Claim Status');
        setStartDate('');
        setEndDate('');
    };

    return (
    <AdminLayout user={auth.user}>
        <Head title="Reports" />
        <div className="p-8 bg-[#F8FAFC] min-h-screen">
            
            {/* Main Content Card */}
            <div className="bg-white rounded-[2rem] shadow-sm border-2 border-blue-100 overflow-hidden">
                
                {/* Header & Filters Section - အကုန်တစ်တန်းတည်း ညှိထားသည် */}
                <div className="p-6 border-b border-slate-100 bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Left Side: Title & Icon */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="p-2 bg-blue-600 rounded-lg text-white">
                                <ClipboardList size={24} />
                            </div>
                            <h1 className="text-2xl font-black text-blue-600 tracking-tight">Reports</h1>
                        </div>

                        {/* Right Side: Filters, Dates, Buttons */}
                        <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                            
                            {/* Dropdown Filters */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <select 
                                        value={contractStatus}
                                        onChange={(e) => {
                                            setContractStatus(e.target.value);
                                            setClaimStatus('Claim Status'); 
                                        }}
                                        className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Status">Status</option> 
                                        <option value="Active">Active</option>
                                        <option value="Expire">Expire</option>
                                        <option value="Cancel">Cancel</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <select 
                                        value={claimStatus}
                                        onChange={(e) => {
                                            setClaimStatus(e.target.value);
                                            setContractStatus('Status'); 
                                        }}
                                        className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Claim Status">Claim Status</option>
                                        <option value="Claimed">Claimed</option>
                                        <option value="No Claim">No Claim</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date Range Picker */}
                            <div className="flex items-center gap-2 bg-[#E2E8F0] rounded-xl px-4 py-1.5 border-none">
                                <Calendar size={18} className="text-slate-500" />
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase" />
                                <span className="text-slate-800 font-bold px-1">To</span>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-slate-500 w-28 uppercase" />
                            </div>
                            
                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                <button onClick={resetFilters} className="bg-[#D3E3F8] hover:bg-blue-200 text-blue-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm">
                                    Clear
                                </button>

                              <button 
                                onClick={downloadExcel} 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
                            >
                                <FileDown size={18} />
                                Excel
                            </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Table Section */}
                <div className="reports-datatable-container p-2">
                    <DataTable 
                        columns={columns}
                        data={filteredReports}
                        pagination={pagination}
                    />
                </div>
            </div>

            {/* CSS Styling  */}
            <style dangerouslySetInnerHTML={{ __html: `
                .reports-datatable-container .bg-white > div:first-child { display: none !important; }
                .reports-datatable-container table { border: none !important; border-radius: 1.5rem !important; overflow: hidden !important; }
                .reports-datatable-container thead tr { background-color: #D3E3F8 !important; }
                .reports-datatable-container thead th { color: #1e293b !important; font-weight: 900 !important; border-right: 1px solid #bfdbfe !important; }
                .reports-datatable-container tbody td { border-right: 1px solid #f1f5f9 !important; padding: 0.75rem 1.25rem !important; vertical-align: middle !important; }
            `}} />
        </div>
    </AdminLayout>
);
}