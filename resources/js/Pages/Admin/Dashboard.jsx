import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Users, FileText, Banknote } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function Dashboard({ stats, recentContracts, recentClaims }) {
  const { auth } = usePage().props;

  console.log(stats)
  // Mapping the top KPI cards to real stats from the controller
 const cards = [
        {
            title: "Active Contracts",
            value: stats?.contracts ?? 0, // Matches 'contracts' key from Controller
            icon: <FileText size={48} />,
        },
        {
            title: "Total Customers",
            value: stats?.users ?? 0, // Matches 'users' key from Controller
            icon: <Users size={48} />,
        },
        {
            title: "Total Claims",
            value: stats?.claims ?? 0, // Matches 'claims' key from Controller
            icon: <Banknote size={48} />,
        },
    ];
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
        <p className="text-sm font-bold text-gray-600">{payload[0].payload.label}</p>
        <p className="text-xl font-extrabold text-[#3B82F6]">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};
  return (
    <AdminLayout auth={auth}>
      <Head title="Dashboard" />

      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-700 mb-8">Dashboard</h1>

        {/* Top Cards with Real Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {cards.map((card, index) => (
            <div key={index} className="bg-[#D9E9F9] rounded-2xl p-8 flex items-center justify-between shadow-sm border border-blue-200">
              <div className="flex items-center gap-4">
                {card.icon}
                <div className="flex flex-col">
                  <p className="text-lg font-medium text-gray-700">{card.title}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{card.value.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Yearly Plan Sales (Chart Data placeholder) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-bold text-gray-800">Yearly Plan Sales</h2>
    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
      2026 Stats
    </span>
  </div>

  <div className="h-[350px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={stats?.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
        <XAxis 
          dataKey="label" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#94A3B8', fontSize: 12 }} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
        <Bar 
          dataKey="value" 
          radius={[6, 6, 0, 0]} 
          barSize={45}
        >
          {stats?.chart_data?.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={index === 2 ? '#3B82F6' : '#93C5FD'} // Highlights the 'Premium' bar darker
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

          {/* Right Side: Dynamic Tables */}
          <div className="space-y-8">
            
            {/* Recent Contract List Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-600"></div>
                  <h2 className="font-bold text-gray-700 uppercase">Recent Contract List</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm border-collapse">
                   <thead className="bg-[#BDD4EB] text-gray-700">
                     <tr>
                       <th className="p-2 border border-gray-300">ContractID</th>
                       <th className="p-2 border border-gray-300">Customer Name</th>
                       <th className="p-2 border border-gray-300">Status</th>
                     </tr>
                   </thead>
                   <tbody>
                      {recentContracts?.map((contract) => (
                        <tr key={contract.id} className="hover:bg-gray-50">
                          <td className="p-2 border border-gray-300">{contract.contract_id}</td>
                          <td className="p-2 border border-gray-300 font-medium">{contract.customer?.name}</td>
                          <td className="p-2 border border-gray-300">{contract.status}</td>
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Recent Claim List Table */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-600"></div>
                  <h2 className="font-bold text-gray-700 uppercase">Recent Claim List</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#BDD4EB] text-gray-700">
                      <tr>
                        <th className="p-2 border border-gray-300">ClaimID</th>
                        <th className="p-2 border border-gray-300">Amount</th>
                        <th className="p-2 border border-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentClaims?.map((claim) => (
                        <tr key={claim.id} className="hover:bg-gray-50">
                          <td className="p-2 border border-gray-300">{claim.claim_id}</td>
                          <td className="p-2 border border-gray-300">{Number(claim.claim_amount || 0).toLocaleString()}</td>
                          <td className="p-2 border border-gray-300">{claim.status}</td>
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