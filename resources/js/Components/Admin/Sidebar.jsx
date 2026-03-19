
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, FileText, ShieldCheck, CreditCard, PieChart, Users } from 'lucide-react';

export default function Sidebar() {
    const { url, props } = usePage();
    const userRole = props.auth.user.role;

    const menuItems = [
        { name: 'Dash Board', icon: <LayoutDashboard size={20}/>, url: '/admin/dashboard' },
        { name: 'Contract List', icon: <FileText size={20}/>, url: '/admin/contracts' },
        { name: 'Insurance Premium', icon: <CreditCard size={20}/>, url: '/admin/premiums' },
        { name: 'Claims & Benefits', icon: <ShieldCheck size={20}/>, url: '/admin/claims' },
        { name: 'Reports', icon: <PieChart size={20}/>, url: '/admin/reports' },
        { 
            name: 'User Management', 
            icon: <Users size={20}/>, 
            url: '/admin/users',
            restricted: true 
        },
    ];

    return (
        <aside className="w-64 bg-[#E8F1FC] min-h-screen p-4 flex flex-col border-r border-blue-100">
            <div className="flex items-center gap-2 mb-10 px-2">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white"><ShieldCheck size={24} /></div>
                <h1 className="text-sm font-bold leading-tight text-slate-800 uppercase">
                    Travel Insurance <br /> <span className="text-blue-600">System</span>
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    if (item.restricted && userRole !== 'superadmin') return null;
                    const isActive = url.startsWith(item.url);
                    return (
                        <Link key={item.name} href={item.url}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                                ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-blue-50'}`}>
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}