import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import axios from 'axios';

export default function ClaimCreate({ auth }) {
    const planDetails = {
        '1': { name: 'Basic', amount: 25000, coverage: 'Medical Only' },
        '2': { name: 'Standard', amount: 50000, coverage: 'Medical + Trip Cancellation' },
        '3': { name: 'Premium', amount: 300000, coverage: 'Standard + Death Benefit' },
    };

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
                    const autoAmount = planDetails[res.plan_id]?.amount || '';

                    setData(prev => ({
                        ...prev,
                        full_name: res.full_name,
                        email: res.email || '',
                        phone: res.phone,
                        plan_id: String(res.plan_id),
                        claim_amount: autoAmount,
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
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Policy Number</label>
                        <input
                            type="text"
                            className={`w-full rounded-lg focus:ring-blue-500 ${errors.policy_no ? 'border-red-500' : 'border-slate-300'}`}
                            placeholder="Enter Policy Number"
                            value={data.policy_no}
                            onChange={e => setData('policy_no', e.target.value)}
                            onBlur={handlePolicyBlur}
                        />
                        {errors.policy_no && <div className="text-red-600 text-xs mt-1 font-medium">{errors.policy_no}</div>}
                    </div>

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
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Insurance Plan</label>
                            <select
                                className="w-full border-slate-300 rounded-lg bg-slate-50 text-slate-600"
                                value={data.plan_id}
                                disabled
                                onChange={e => {
                                    const val = e.target.value;
                                    setData(prev => ({
                                        ...prev,
                                        plan_id: val,
                                        claim_amount: planDetails[val]?.amount || ''
                                    }));
                                }}
                            >
                                <option value="">-- Plan --</option>
                                <option value="1">Basic</option>
                                <option value="2">Standard</option>
                                <option value="3">Premium</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Claimed Amount (MMK)</label>
                            <input
                                type="text"
                                readOnly
                                className="w-full bg-slate-50 border-slate-200 rounded-lg text-blue-600 font-bold cursor-not-allowed"
                                value={data.claim_amount ? Number(data.claim_amount).toLocaleString() : '0'}
                            />
                        </div>
                    </div>

                    {data.plan_id && (
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg animate-in fade-in slide-in-from-left-2">
                            <h4 className="text-sm font-bold text-blue-800 underline mb-1">Plan Details: {planDetails[data.plan_id].name}</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Coverage Scope: <strong>{planDetails[data.plan_id].coverage}</strong>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Accident</label>
                            <input
                                type="date"
                                className={`w-full rounded-lg focus:ring-blue-500 ${errors.accident_date ? 'border-red-500' : 'border-slate-300'}`}
                                value={data.accident_date}
                                onChange={e => setData('accident_date', e.target.value)}
                            />
                            {errors.accident_date && <div className="text-red-600 text-xs mt-1 font-medium">{errors.accident_date}</div>}
                        </div>
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

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Claim Description / Reason</label>
                        <textarea
                            rows="3"
                            className={`w-full rounded-lg focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
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