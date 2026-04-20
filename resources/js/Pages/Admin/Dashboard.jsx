import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Users, FileText, Banknote, Calendar } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function Dashboard({ stats, recentContracts, recentClaims }) {
  const { auth } = usePage().props;

  // 1. Updated KPI Config
  const cards = [
    {
      title: "Active Contracts",
      value: stats?.contracts ?? 0,
      icon: <FileText className="text-blue-600" size={24} />,
      accent: "bg-blue-600",
      description: "Total travel policies"
    },
    {
      title: "Total Customers",
      value: stats?.users ?? 0,
      icon: <Users className="text-purple-600" size={24} />,
      accent: "bg-purple-600",
      description: "Registered travelers"
    },
    {
      title: "Total Claims",
      value: stats?.claims ?? 0,
      icon: <Banknote className="text-emerald-600" size={24} />,
      accent: "bg-emerald-600",
      description: "Claims processed"
    },
  ];

  // 2. Enhanced Status Badge with distinct colors
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/10",
      approved: "bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/10",
      active: "bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/10",
      paid: "bg-indigo-100 text-indigo-700 border-indigo-200 ring-indigo-500/10",
      rejected: "bg-rose-100 text-rose-700 border-rose-200 ring-rose-500/10",
      cancelled: "bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10",
    };
    const current = styles[status?.toLowerCase()] || "bg-gray-100 text-gray-600 border-gray-200";
    
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${current} uppercase tracking-wider`}>
        {status}
      </span>
    );
  };

  // Helper to safely resolve routes to avoid Ziggy crashes
  const safeRoute = (name, fallback = "#") => {
    try {
      return route().has(name) ? route(name) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  return (
    <AdminLayout auth={auth}>
      <Head title="Admin Dashboard" />

      <div className="p-6 lg:p-10 bg-[#F8FAFC] min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-slate-500 mt-1">Real-time statistics for the Travel Insurance System</p>
          </div>
          
          {/* 3. Modernized Year Display (Replacing Dropdown) */}
         
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card, index) => (
            <div key={`card-${index}`} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${card.accent}`}></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-2">{card.value.toLocaleString()}</h3>
                  <p className="text-xs text-slate-400 mt-1">{card.description}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors">
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800">Plan Sales Analytics</h2>
              <p className="text-sm text-slate-400">Monthly distribution of sold plans</p>
            </div>

            <div className="h-[380px] min-h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.chart_data || []} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC', radius: 8 }}
                    content={({ active, payload }) => active && payload?.length ? (
                      <div className="bg-slate-900 text-white p-3 shadow-xl rounded-xl border-none">
                        <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">{payload[0].payload.label}</p>
                        <p className="text-lg font-black">{payload[0].value} <span className="text-xs font-normal opacity-70 italic">Sold</span></p>
                      </div>
                    ) : null}
                  />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={32}>
                    {stats?.chart_data?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index % 2 === 0 ? '#3B82F6' : '#E2E8F0'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Tables */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Contracts */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  Recent Contracts
                </h2>
                <Link href={safeRoute('admin.contracts.index')} className="text-xs font-bold text-blue-600 hover:text-blue-800">View All</Link>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-3">Contract Number</th>
                    <th className="px-6 py-3">Customer Name</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentContracts?.slice(0, 5).map((contract) => (
                    <tr key={`contract-${contract.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
    {/* <p className="text-[10px] font-mono text-slate-400 leading-none mb-1">{claim.policy_no}</p> */}
    <p className="text-sm font-bold text-slate-700">
        {contract.contract_id}
    </p>
</td>
                      <td className="px-6 py-4">
                        {/* <p className="text-xs font-mono text-slate-400">{contract.contract_id}</p> */}
                        <p className="text-sm font-bold text-slate-700">{contract.customer?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={contract.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Claims */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  Recent Claims
                </h2>
              {/* Change from admin.claims.index to claims.index */}
<Link 
  href={route('claims.index')} 
  className="text-xs font-bold text-emerald-600 hover:text-emerald-800"
>
  View All
</Link> </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400">
                   <th className="px-6 py-3">Claim ID</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentClaims?.slice(0, 5).map((claim) => (
                    <tr key={`claim-${claim.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
    {/* <p className="text-[10px] font-mono text-slate-400 leading-none mb-1">{claim.policy_no}</p> */}
    <p className="text-sm font-bold text-slate-700">
        {claim.claim_id}
    </p>
</td>
                      <td className="px-6 py-4">
                        {/* <p className="text-[10px] font-mono text-slate-400 leading-none mb-1">{claim.claim_id}</p> */}
                        <p className="text-sm font-bold text-slate-700">
                          {Number(claim.claim_amount || 0).toLocaleString()} <span className="text-[10px] text-slate-400">MMK</span>
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <StatusBadge status={claim.claim_status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}