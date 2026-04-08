import React, { useState, useMemo } from 'react';
import { Edit3, Trash2, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const DataTable = ({ 
    columns = [], 
    data = [], 
    pagination, 
    renderExtra, 
    title = "Management" 
}) => {
    const [search, setSearch] = useState('');

    // Filter Logic: data က array ဖြစ်မှ အလုပ်လုပ်အောင် စစ်ထားပါတယ်
    const filteredData = useMemo(() => {
        const safeData = Array.isArray(data) ? data : [];
        if (!search) return safeData;

        return safeData.filter(row =>
            columns.some(col => {
                const cellValue = row[col.key];
                return String(cellValue ?? '').toLowerCase().includes(search.toLowerCase());
            })
        );
    }, [data, columns, search]);

    const totalPages = pagination?.last_page || 1;
    const currentPage = pagination?.current_page || 1;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md">
                        <Filter size={18} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        />
                    </div>
                    {renderExtra && <div className="shrink-0">{renderExtra}</div>}
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-extrabold tracking-wider">
                        <tr>
                            {columns?.map(col => (
                                <th key={col.key} className="p-4 border-b border-slate-100 text-center">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-slate-600">
                        {filteredData.length > 0 ? (
                            filteredData.map((row, i) => (
                                <tr key={row.id || i} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors">
                                    {columns?.map(col => (
                                        <td key={col.key} className="p-4 text-center align-middle">
                                            {/* Render function ရှိရင် render ကိုသုံးမယ်၊ မရှိရင် data အတိုင်းပြမယ် */}
                                            {col.render 
                                                ? col.render(row[col.key], row) 
                                                : (row[col.key] ?? <span className="text-slate-300">-</span>)
                                            }
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns?.length} className="p-20 text-center">
                                    <div className="text-slate-300 italic">No records found.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6 px-2">
                <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                    Page <span className="text-blue-600">{currentPage}</span> of {totalPages}
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => pagination?.onPageChange?.(currentPage - 1)} 
                        disabled={currentPage === 1} 
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronLeft size={16}/>
                    </button>
                    <button 
                        onClick={() => pagination?.onPageChange?.(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                        className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                    >
                        <ChevronRight size={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;