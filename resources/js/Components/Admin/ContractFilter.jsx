import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function ContractFilter({ values, onChange, onClear, statusOptions }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
                <select
                    value={values.status}
                    onChange={(e) => onChange('status', e.target.value)}
                    className="appearance-none bg-[#E0E0E0] border-none rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-600 focus:ring-0 cursor-pointer"
                >
                    <option value="">Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Date Range Group */}
            <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#E0E0E0] rounded-xl px-3 py-2 gap-2">
                    <Calendar size={18} className="text-gray-600" />
                    <input
                        type="date"
                        value={values.startDate}
                        onChange={(e) => onChange('startDate', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 w-28"
                    />
                </div>

                <span className="text-gray-700 font-bold text-sm">To</span>

                <div className="flex items-center bg-[#E0E0E0] rounded-xl px-3 py-2 gap-2">
                    <Calendar size={18} className="text-gray-600" />
                    <input
                        type="date"
                        value={values.endDate}
                        onChange={(e) => onChange('endDate', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 w-28"
                    />
                </div>
            </div>

            <button
                onClick={onClear}
                className="bg-[#D9E7F9] hover:bg-blue-100 text-[#3B82F6] px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
                Clear
            </button>
        </div>
    );
}