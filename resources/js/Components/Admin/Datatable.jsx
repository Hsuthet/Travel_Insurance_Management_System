import React, { useState, useMemo } from 'react';
import { Edit3, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
const DataTable = ({
   columns,
   data = [],
   pagination,
   onEdit,
   onDelete,
   renderExtra,
   title = "Management",
   icon: Icon = Filter
}) => {
   const [search, setSearch] = useState('');
   // Filtered data based on search input
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
   const totalPages = pagination?.last_page || 1;
   const currentPage = pagination?.current_page || 1;
   // Helper to get correct ID (row.id or row.claim_id or row.user_id etc.)
   const getRowId = (row) => row.id || row.claim_id || row.user_id;
   const renderPageNumbers = () => {
       let pages = [];
       for (let i = 1; i <= totalPages; i++) {
           pages.push(
<button
                   key={i}
                   onClick={() => pagination?.onPageChange?.(i)}
                   className={`px-3 py-1 rounded-md border text-xs font-medium transition-colors ${
                       i === currentPage
                           ? 'bg-blue-600 text-white border-blue-600'
                           : 'bg-white text-slate-600 hover:bg-blue-50 border-slate-200'
                   }`}
>
                   {i}
</button>
           );
       }
       return pages;
   };
   return (
<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
           {/* Header Area */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
<div className="flex items-center gap-3">
<div className="bg-blue-600 text-white p-2 rounded-lg shadow-md shadow-blue-100">
<Icon size={18} />
</div>
<h2 className="text-lg font-bold text-slate-800">{title}</h2>
</div>
<div className="flex items-center gap-3 w-full md:w-auto">
                   {renderExtra && <div className="shrink-0">{renderExtra}</div>}
</div>
</div>
           {/* Table Area */}
<div className="overflow-x-auto rounded-xl border border-slate-100">
<table className="w-full text-sm text-left border-collapse">
<thead className="bg-[#D3E3F8] text-slate-500 uppercase text-[11px] tracking-wider font-bold">
<tr>
                           {columns?.map(col => (
<th key={col.key} className="p-4 border-b border-slate-100">
                                   {col.label}
</th>
                           ))}
</tr>
</thead>
<tbody className="text-slate-600">
                       {filteredData?.length > 0 ? (
                           filteredData.map((row, i) => (
<tr key={i} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                                   {columns?.map(col => (
<td key={col.key} className="p-4">
                                           {/* ပြင်ဆင်လိုက်သော အပိုင်း: Custom Render ရှိရင် Render ကိုသုံး၊ မရှိရင် Default Action သုံး */}
                                           {col.render ? (
                                               col.render(row)
                                           ) : col.key === 'actions' ? (
<div className="flex gap-2">
                                                   {onEdit && (
<button
                                                           onClick={() => onEdit(getRowId(row))}
                                                           className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                                           title="Edit"
>
<Edit3 size={16} />
</button>
                                                   )}
                                                   {onDelete && (
<button
                                                           onClick={() => onDelete(getRowId(row))}
                                                           className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                           title="Delete"
>
<Trash2 size={16} />
</button>
                                                   )}
</div>
                                           ) : (
                                               row?.[col.key] ?? '-'
                                           )}
</td>
                                   ))}
</tr>
                           ))
                       ) : (
<tr>
<td colSpan={columns?.length} className="p-10 text-center text-slate-400 italic">
                                   No records found.
</td>
</tr>
                       )}
</tbody>
</table>
</div>
           {/* Pagination Area */}
<div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
<div className="flex items-center gap-3 text-xs font-medium text-slate-500">
<span>Show</span>
<select
                       className="border border-slate-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                       value={pagination?.per_page || 10}
                       onChange={e => pagination?.onLimitChange?.(Number(e.target.value))}
>
                       {[5, 10, 25, 50].map(v => (
<option key={v} value={v}>{v}</option>
                       ))}
</select>
<span>entries</span>
</div>
<div className="flex items-center gap-2">
<button
                       onClick={() => pagination?.onPageChange?.(currentPage - 1)}
                       disabled={currentPage === 1}
                       className="p-2 border border-slate-200 rounded-md disabled:opacity-30 hover:bg-slate-50 transition-colors"
>
<ChevronLeft size={16} />
</button>
<div className="flex gap-1">{renderPageNumbers()}</div>
<button
                       onClick={() => pagination?.onPageChange?.(currentPage + 1)}
                       disabled={currentPage === totalPages}
                       className="p-2 border border-slate-200 rounded-md disabled:opacity-30 hover:bg-slate-50 transition-colors"
>
<ChevronRight size={16} />
</button>
</div>
</div>
</div>
   );
};
export default DataTable;