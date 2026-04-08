import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Components/Admin/DataTable';
import PaymentFilter from '@/Components/Admin/PaymentFilter';
import { Head, router } from '@inertiajs/react';
import { CreditCard } from 'lucide-react';

const statusStyles = {
    'Accepted': 'bg-[#4CAF50] text-white',
    'Pending':  'bg-[#FF8A65] text-white',
};

const columns = [
    { label: 'CONTRACT ID', key: 'contract_id' },
    { label: 'PREMIUM AMOUNT', key: 'premium_amount' },
    { label: 'PAYMENT DATE', key: 'pay_date' },
    { 
        label: 'STATUS', 
        key: 'status',
        render: (val) => (
            <div className="flex justify-center">
                <span className={`px-4 py-0.5 rounded-full text-[11px] font-bold uppercase min-w-[85px] text-center shadow-sm ${statusStyles[val] || 'bg-gray-300'}`}>
                    {val}
                </span>
            </div>
        )
    }
];

// Payment.jsx ထဲက Submit Handler
const handleSubmit = (e) => {
    e.preventDefault();

    // ၁။ GMO ရဲ့ Library ကိုသုံးပြီး Token တောင်းမယ်
    // ဒီ Window.Multipayment က GMO ကပေးတဲ့ JS ဖြစ်ရပါမယ်
    window.Multipayment.getToken({
        cardno: data.cardNumber,
        expire: data.expYear + data.expMonth,
        securitycode: data.cvv,
        holdername: data.cardName
    }, (response) => {
        if (response.resultCode === "000") {
            // ၂။ Token ရပြီဆိုရင် Backend (Laravel) ကို Token ပဲ ပို့မယ်
            const token = response.tokenObject.token[0];
            
            // Inertia သုံးပြီး Controller ဆီ ပို့တာ ပိုကောင်းပါတယ်
            router.post('/payments/gmo', {
                token: token,
                amount: data.amount,
                contract_id: data.contract_id
            });
        } else {
            // Error handling
            alert("Card Error: " + response.resultCode);
        }
    });
};

export default function PaymentList({ payments, auth, filters }) {
    
    // Debug လုပ်ဖို့အတွက် (Data ရောက်မရောက် ဒီမှာ ကြည့်ပါ)
    console.log("Payments Data:", payments?.data);

    const handleFilterChange = (key, value) => {
        router.get(route('admin.payments.index'), 
            { ...filters, [key]: value, page: 1 }, 
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleClear = () => {
        router.get(route('admin.payments.index'), {}, { replace: true });
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Insurance Premium List" />
            <div className="p-6 space-y-4 max-w-[1450px] mx-auto">
                
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm gap-4">
                    <div className="flex items-center gap-2 text-[#3B82F6] font-extrabold text-xl shrink-0">
                        <CreditCard size={24} strokeWidth={3} />
                        Insurance Premium List
                    </div>
                    
                    <PaymentFilter 
                        values={filters} 
                        onChange={handleFilterChange}
                        onClear={handleClear}
                        statusOptions={['success', 'pending', 'failed']} 
                    />
                </div>

                <div className="bg-white rounded-[20px] border-[2.5px] border-[#A5C9F3] overflow-hidden shadow-lg p-0.5">
                    <DataTable 
                        columns={columns} 
                        // payments?.data ဖြစ်ရပါမယ် (undefined မဖြစ်အောင် guard ထည့်ထားတယ်)
                        data={payments?.data || []} 
                        pagination={{
                            current_page: payments?.current_page,
                            last_page: payments?.last_page,
                            onPageChange: (page) => {
                                router.get(route('admin.payments.index'), { ...filters, page }, {
                                    preserveState: true,
                                    replace: true,
                                    preserveScroll: true
                                });
                            }
                        }}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}