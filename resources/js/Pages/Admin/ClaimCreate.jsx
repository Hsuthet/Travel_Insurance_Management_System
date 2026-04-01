import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import axios from 'axios';

export default function ClaimCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        policy_no: '',
        full_name: '',
        email: '',
        phone: '',
        plan_id: '',
        accident_date: new Date().toISOString().split('T')[0],
        claim_amount: '',
        description: '',
    });

    const handlePolicyBlur = async (e) => {
        const policyNo = e.target.value;
        if (policyNo.length >= 5) {
            try {
                const response = await axios.get(`/admin/get-contract/${policyNo}`);
                if (response.data.success) {
                    const res = response.data;
                    setData(prev => ({
                        ...prev,
                        full_name: res.full_name,
                        email: res.email || '',
                        phone: res.phone,
                        plan_id: res.plan_id,
                    }));
                }
            } catch (error) {
                console.error("Contract not found");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.claims.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Add New Claim" />
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-10">
                <div className="border-b border-slate-100 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Travel Insurance Claim Request Form</h1>
                    <p className="text-slate-500"></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Policy Number */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Policy Number</label>
                        <input
                            type="text"
                            className={`w-full rounded-lg focus:ring-blue-500 ${errors.policy_no ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300'}`}
                            placeholder="Enter Policy Number"
                            value={data.policy_no}
                            onChange={e => setData('policy_no', e.target.value)}
                            onBlur={handlePolicyBlur}
                        />
                        {errors.policy_no && <div className="text-red-600 text-xs mt-1 font-medium">{errors.policy_no}</div>}
                    </div>

                    {/* Customer Full Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Full Name</label>
                        <input
                            type="text"
                            readOnly
                            className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                            value={data.full_name}
                            placeholder="Auto-filled from Policy Number"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                readOnly
                                className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                value={data.email}
                                placeholder="Auto-filled email"
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                readOnly
                                className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                value={data.phone}
                                placeholder="Auto-filled phone"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Accident Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Accident</label>
                            <input
                                type="date"
                                className={`w-full rounded-lg focus:ring-blue-500 ${errors.accident_date ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300'}`}
                                value={data.accident_date}
                                onChange={e => setData('accident_date', e.target.value)}
                            />
                            {errors.accident_date && <div className="text-red-600 text-xs mt-1 font-medium">{errors.accident_date}</div>}
                        </div>
                        {/* Claim Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Claimed Amount (MMK)</label>
                            <input
                                type="number"
                                className={`w-full rounded-lg focus:ring-blue-500 ${errors.claim_amount ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300'}`}
                                placeholder="0.00"
                                value={data.claim_amount}
                                onChange={e => setData('claim_amount', e.target.value)}
                            />
                            {errors.claim_amount && <div className="text-red-600 text-xs mt-1 font-medium">{errors.claim_amount}</div>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Claim Description / Reason</label>
                        <textarea
                            rows="4"
                            className={`w-full rounded-lg focus:ring-blue-500 ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-slate-300'}`}
                            placeholder="Provide details about the accident or incident..."
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        ></textarea>
                        {errors.description && <div className="text-red-600 text-xs mt-1 font-medium">{errors.description}</div>}
                    </div>

                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100">
                        <Link href={route('admin.claims.index')} className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Registering...' : 'Register Claim'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}