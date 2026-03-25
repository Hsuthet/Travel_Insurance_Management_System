import React from 'react';
import { Calendar } from 'lucide-react';

export default function ContractFilter({ values, onChange, onClear, statusOptions }) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
                <select
                    value={values.status}
                    onChange={(e) => onChange('status', e.target.value)}
                    className="appearance-none bg-[#E0E0E0] border-none rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-blue-400 cursor-pointer"
                >
                    <option value="">Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                {/* Custom chevron for the select */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>

            {/* Date Range Group */}
            <div className="flex items-center gap-2">
                {/* Start Date */}
                <div className="flex items-center bg-[#E0E0E0] rounded-xl px-3 py-2 gap-2 w-40">
                    <Calendar size={18} className="text-gray-600" />
                    <input
                        type="date"
                        value={values.startDate}
                        onChange={(e) => onChange('startDate', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 w-full"
                        placeholder="mm/dd/yy"
                    />
                </div>

                <span className="text-gray-700 font-bold text-sm">To</span>

                {/* End Date */}
                <div className="flex items-center bg-[#E0E0E0] rounded-xl px-3 py-2 gap-2 w-40">
                    <Calendar size={18} className="text-gray-600" />
                    <input
                        type="date"
                        value={values.endDate}
                        onChange={(e) => onChange('endDate', e.target.value)}
                        className="bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 w-full"
                        placeholder="mm/dd/yy"
                    />
                </div>
            </div>

            {/* Clear Button */}
            <button
                onClick={onClear}
                className="bg-[#D9E7F9] hover:bg-blue-100 text-[#3B82F6] px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
            >
                Clear
            </button>
        </div>
    );
}