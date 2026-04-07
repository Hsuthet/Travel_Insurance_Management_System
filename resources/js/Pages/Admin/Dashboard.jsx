import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Users, FileText, Banknote, ArrowUpRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function Dashboard({ stats, recentContracts, recentClaims }) {
  const { auth } = usePage().props;

  const cards = [
    {
      title: "Active Contracts",
      value: stats?.contracts ?? 0,
      icon: <FileText className="text-blue-600" size={28} />,
      accent: "bg-blue-600",
      description: "Total travel policies"
    },
    {
      title: "Total Customers",
      value: stats?.users ?? 0,
      icon: <Users className="text-purple-600" size={28} />,
      accent: "bg-purple-600",
      description: "Registered travelers"
    },
    {
      title: "Total Claims",
      value: stats?.claims ?? 0,
      icon: <Banknote className="text-emerald-600" size={28} />,
      accent: "bg-emerald-600",
      description: "Claims processed"
    },
  ];

  // Helper to render Status Badges
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-100",
      approved: "bg-emerald-50 text-emerald-700 border-emerald-100",
      paid: "bg-blue-50 text-blue-700 border-blue-100",
      rejected: "bg-rose-50 text-rose-700 border-rose-100",
    };
    const current = styles[status?.toLowerCase()] || "bg-gray-50 text-gray-600 border-gray-100";
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${current} capitalize`}>
        {status}
      </span>
    );
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
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
              Download Report
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
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
          {/* Left Side: Analytics Chart (Span 3) */}
          <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Plan Sales Analytics</h2>
                <p className="text-sm text-slate-400">Monthly distribution of sold plans</p>
              </div>
              <select className="text-sm border-slate-200 rounded-lg focus:ring-blue-500">
                <option>Year 2026</option>
              </select>
            </div>

            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.chart_data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#F1F5F9', radius: 10 }}
                    content={({ active, payload }) => active && payload ? (
                      <div className="bg-slate-900 text-white p-3 shadow-xl rounded-xl border-none">
                        <p className="text-xs opacity-70 font-bold">{payload[0].payload.label}</p>
                        <p className="text-lg font-black">{payload[0].value} Plans</p>
                      </div>
                    ) : null}
                  />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                    {stats?.chart_data?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#94A3B8'} fillOpacity={index % 2 === 0 ? 1 : 0.3} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Side: Activity Tables (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Contracts */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  Recent Contracts
                </h2>
                <Link className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[11px] uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-3 font-bold">ID</th>
                      <th className="px-6 py-3 font-bold">Customer</th>
                      <th className="px-6 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentContracts?.slice(0, 5).map((contract) => (
                      <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{contract.contract_id}</td>
                        <td className="px-6 py-4">
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
            </div>

            {/* Recent Claims */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  Recent Claims
                </h2>
                <Link className="text-xs font-bold text-emerald-600 hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-50">
                    {recentClaims?.slice(0, 5).map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="text-xs font-mono text-slate-400">{claim.claim_id}</p>
                           <p className="font-bold text-slate-700 mt-1 underline decoration-emerald-200">
                             {Number(claim.claim_amount || 0).toLocaleString()} MMK
                           </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <StatusBadge status={claim.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}