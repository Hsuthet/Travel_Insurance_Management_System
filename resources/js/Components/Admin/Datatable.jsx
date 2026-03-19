import React from 'react';
import { usePage } from '@inertiajs/react';
import { Edit3, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ columns, data, filters, onFilterChange, pagination }) => {
    const { auth } = usePage().props;
    if (!pagination) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Filter size={18} /></div>
                    <h2 className="text-lg font-semibold text-slate-700">Data Management</h2>
                </div>
                {auth.user.role === 'superadmin' && (
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700">+ Add New</button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm text-center">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                        <tr>{columns.map(col => <th key={col.key} className="p-3 font-semibold">{col.label}</th>)}</tr>
                    </thead>
                    <tbody>
                        {data?.length > 0 ? data.map((row, i) => (
                            <tr key={i} className="border-t hover:bg-slate-50">
                                {columns.map(col => (
                                    <td key={col.key} className="p-3">
                                        {col.key === 'actions' ? (
                                            auth.user.role === 'superadmin' ? (
                                                <div className="flex justify-center gap-2">
                                                    <button className="p-2 bg-blue-500 text-white rounded-md"><Edit3 size={14} /></button>
                                                    <button className="p-2 bg-red-500 text-white rounded-md"><Trash2 size={14} /></button>
                                                </div>
                                            ) : <span className="text-slate-400">-</span>
                                        ) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        )) : <tr><td colSpan={columns.length} className="p-6 text-slate-400">No data found</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span>Rows:</span>
                    <select className="border border-slate-200 rounded-md px-2 py-1"
                        value={pagination.per_page} onChange={(e) => pagination.onLimitChange?.(Number(e.target.value))}>
                        {[5, 10, 25, 50].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => pagination.onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-2 border rounded-md disabled:opacity-30"><ChevronLeft size={18} /></button>
                    <button onClick={() => pagination.onPageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-2 border rounded-md disabled:opacity-30"><ChevronRight size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;