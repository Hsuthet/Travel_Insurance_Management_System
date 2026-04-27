import React, { useState, useMemo } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
    columns,
    data = [],
    pagination,
    renderExtra,
    title = "",
    icon: Icon = Filter
}) => {
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter(row =>
            columns.some(col =>
                String(row?.[col.key] ?? '')
                    .toLowerCase()
                    .includes(search.toLowerCase())
            )
        );
    }, [data, columns, search]);

    const currentPage = pagination?.current_page || 1;
    const perPage = pagination?.per_page || 10;
    const totalPages = pagination?.last_page || 1;

    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => pagination?.onPageChange?.(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                        i === currentPage
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md shadow-blue-100">
                        <Icon size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* <input 
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full md:w-64 transition-all"
                    /> */}
                    {renderExtra && <div className="shrink-0">{renderExtra}</div>}
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-[#D3E3F8]/50 text-slate-500 uppercase text-[11px] tracking-wider font-bold">
                        <tr>
                            {columns?.map((col, index) => (
                                <th key={col.key || index} className="p-4 border-b border-slate-100">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {filteredData?.length > 0 ? (
                            filteredData.map((row, i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-none hover:bg-blue-50/30 transition-colors">
                                    {columns?.map((col, j) => (
                                        <td key={col.key || j} className="p-4">
                                            {col.render ? col.render(row, i) : (row?.[col.key] ?? '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns?.length} className="p-10 text-center text-slate-400 italic">No records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                
                {/* LEFT SIDE: "Show 10 entries" */}
                <div className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
                    <span>Show</span>
                   <div className="relative inline-block">
   <select
    className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 outline-none cursor-pointer hover:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-600 text-sm"
    
    style={{ 
        appearance: 'none', 
        WebkitAppearance: 'none', 
        MozAppearance: 'none',
        backgroundImage: 'none' 
    }}
    value={perPage}
    onChange={e => pagination?.onLimitChange?.(Number(e.target.value))}
>
    {[5, 10, 25, 50].map(v => (
        <option key={v} value={v}>{v}</option>
    ))}
</select>
    
   
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
        </svg>
    </div>
</div>
                    <span>entries</span>
                </div>

                {/* RIGHT SIDE: Navigation Arrows and Numbers */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => pagination?.onPageChange?.(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-slate-400 disabled:opacity-30 hover:text-blue-600 transition-colors border border-slate-100 rounded-md mr-2"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <div className="flex gap-1">
                        {renderPageNumbers()}
                    </div>

                    <button
                        onClick={() => pagination?.onPageChange?.(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-slate-400 disabled:opacity-30 hover:text-blue-600 transition-colors border border-slate-100 rounded-md ml-2"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;