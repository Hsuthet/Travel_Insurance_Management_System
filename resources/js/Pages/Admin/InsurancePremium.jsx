import React, { useState } from 'react'; 
import AdminLayout from '@/Layouts/AdminLayout'; 
import { Head } from '@inertiajs/react';
import { CircleDollarSign, Calendar } from 'lucide-react'; 

export default function InsurancePremium({ auth, premiums }) {
   
    const [status, setStatus] = useState('Status');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const resetFilters = () => {
        setStatus('Status');
        setStartDate('');
        setEndDate('');
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Insurance Premium" />
            
            <div className="p-8 bg-[#F8FAFC] min-h-screen">
              
                <div className="bg-white rounded-[2rem] shadow-sm border-2 border-blue-100 overflow-hidden">
                    
                   
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            {/* Left Side: Title & Icon */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <CircleDollarSign size={24} />
                                </div>
                                <h1 className="text-2xl font-black text-blue-600 tracking-tight">Insurance Premium</h1>
                            </div>

                            {/* Right Side: Filters, Dates, Buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                                
                                {/* Status Filter */}
                                <div className="relative">
                                    <select 
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="appearance-none bg-[#E2E8F0] border-none rounded-xl px-6 py-2.5 text-sm font-bold text-slate-500 pr-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Status">Status</option> 
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                    </select>
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="p-4">
                        <div className="overflow-x-auto shadow-sm border border-blue-100 rounded-[1.5rem]">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-700 uppercase bg-[#D3E3F8]">
                                    <tr>
                                        <th className="px-6 py-4 text-center font-black border-r border-blue-200">Contract ID</th>
                                        <th className="px-6 py-4 text-center font-black border-r border-blue-200">Premium Amount</th>
                                        <th className="px-6 py-4 text-center font-black border-r border-blue-200">Payment Date</th>
                                        <th className="px-6 py-4 text-center font-black">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {premiums.length > 0 ? (
                                        premiums.map((item, index) => (
                                            <tr key={index} className="bg-white hover:bg-blue-50/50 transition-colors">
                                                <td className="px-6 py-4 text-center border-r border-slate-50 font-bold text-slate-600">{item.contract_id}</td>
                                                <td className="px-6 py-4 text-center border-r border-slate-50 font-medium">{item.premium_amount}</td>
                                                <td className="px-6 py-4 text-center border-r border-slate-50">{item.payment_date}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-black border shadow-sm ${
                                                        item.status === 'accepted' 
                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                                        : 'bg-amber-100 text-amber-700 border-amber-200'
                                                    }`}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic font-medium">
                                                No premium data available.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}