import React from 'react';
import { Calendar, RotateCcw } from 'lucide-react';

export default function PaymentFilter({ 
    values = {}, // values က undefined ဖြစ်နေရင် object အလွတ်လို့ သတ်မှတ်မယ်
    onChange, 
    onClear, 
    statusOptions = [] 
}) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            
            {/* Status Dropdown */}
            <div className="relative group">
                <select
                    // values?.status လို့ သုံးထားရင် values မရှိလည်း error မတက်တော့ပါဘူး
                    value={values?.status ?? ''} 
                    onChange={(e) => onChange('status', e.target.value)}
                    className="appearance-none bg-[#F1F5F9] border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-bold text-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer transition-all hover:bg-white"
                >
                    <option value="">Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>

            {/* Date Range Group */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#F1F5F9] border border-slate-200 rounded-xl px-3 py-2 gap-2 w-44">
                    <Calendar size={16} className="text-slate-400" />
                    <input
                        type="date"
                        value={values?.startDate ?? ''}
                        onChange={(e) => onChange('startDate', e.target.value)}
                        className="bg-transparent border-none p-0 text-xs font-bold text-slate-500 focus:ring-0 w-full cursor-pointer"
                    />
                </div>

                <span className="text-slate-400 font-extrabold text-[10px] uppercase tracking-tighter px-1">To</span>

                <div className="flex items-center bg-[#F1F5F9] border border-slate-200 rounded-xl px-3 py-2 gap-2 w-44">
                    <Calendar size={16} className="text-slate-400" />
                    <input
                        type="date"
                        value={values?.endDate ?? ''}
                        onChange={(e) => onChange('endDate', e.target.value)}
                        className="bg-transparent border-none p-0 text-xs font-bold text-slate-500 focus:ring-0 w-full cursor-pointer"
                    />
                </div>
            </div>

            {/* Clear Button */}
            <button
                onClick={onClear}
                className="flex items-center gap-2 bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] px-5 py-2 rounded-xl text-sm font-extrabold transition-all shadow-sm active:scale-95"
            >
                <RotateCcw size={16} strokeWidth={2.5} />
                Clear1
            </button>
        </div>                                                                          
    );
}