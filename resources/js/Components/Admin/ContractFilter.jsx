import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function ContractFilter({ values, onChange, onClear, statusOptions }) {
    
    // Optional: Prevent selecting an end date earlier than the start date
    const handleStartDateChange = (e) => {
        onChange('startDate', e.target.value);
    };

    const handleEndDateChange = (e) => {
        onChange('endDate', e.target.value);
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
                <select
                    value={values.status}
                    // Normalize to lowercase if your backend expects 'active' instead of 'Active'
                    onChange={(e) => onChange('status', e.target.value.toLowerCase())}
                    className="appearance-none bg-[#E0E0E0] border-none rounded-xl px-4 py-2 pr-10 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-blue-300 cursor-pointer transition-all"
                >
                    <option value="">Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Date Range Group */}
            <div className="flex items-center gap-2">
                {/* Start Date */}
                <div className="flex items-center bg-[#E0E0E0] rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
                    <Calendar size={18} className="text-gray-600" />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={values.startDate || ''}
                        onChange={handleStartDateChange}
                        className="bg-transparent border-none p-0 text-sm text-gray-700 focus:ring-0 w-32 cursor-pointer"
                    />
                </div>

                <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">To</span>

                {/* End Date */}
                <div className="flex items-center bg-[#E0E0E0] rounded-xl px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
                    <Calendar size={18} className="text-gray-600" />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={values.endDate || ''}
                        min={values.startDate} // User cannot pick end date before start date
                        onChange={handleEndDateChange}
                        className="bg-transparent border-none p-0 text-sm text-gray-700 focus:ring-0 w-32 cursor-pointer"
                    />
                </div>
            </div>

            {/* Clear Button */}
            <button
                type="button"
                onClick={onClear}
                className="bg-[#D9E7F9] hover:bg-[#3B82F6] hover:text-white text-[#3B82F6] px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
            >
                Clear
            </button>
        </div>
    );
}