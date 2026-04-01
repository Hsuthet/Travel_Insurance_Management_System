import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ClaimEdit({ auth, claim }) {
    const { data, setData, patch, processing, errors } = useForm({
        policy_no: claim.policy_no || '',
        full_name: claim.full_name || '',
        email: claim.email || '',
        phone: claim.phone || '',
        plan_id: claim.plan_id || '',
        accident_date: claim.accident_date ? claim.accident_date.substring(0, 10) : '',
        claim_amount: claim.claim_amount || '',
        description: claim.accident_description || '',
        status: claim.status || 'pending',
    });

   const handleSubmit = (newStatus) => {
        if (confirm(`Are you sure you want to mark this as ${newStatus}?`)) {
            router.patch(route('admin.claims.status', { id: claim.claim_id }), {
                status: newStatus
            });
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Edit Claim" />
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-10">
                <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Edit & Review Claim</h1>
                        <p className="text-slate-500 font-medium italic">Current Status: {claim.status}</p>
                    </div>
                </div>

                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Policy Number</label>
                        <input type="text" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500" value={data.policy_no} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Full Name</label>
                        <input type="text" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500" value={data.full_name} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input type="email" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500" value={data.email} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                            <input type="text" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500" value={data.phone} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Accident</label>
                            <input
                                type="date"
                                className={`w-full rounded-lg ${errors.accident_date ? 'border-red-500' : 'border-slate-300'}`}
                                value={data.accident_date}
                                onChange={e => setData('accident_date', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Claimed Amount (MMK)</label>
                            <input
                                type="number"
                                className={`w-full rounded-lg ${errors.claim_amount ? 'border-red-500' : 'border-slate-300'}`}
                                value={data.claim_amount}
                                onChange={e => setData('claim_amount', e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Claim Description</label>
                        <textarea
                            rows="4"
                            className={`w-full rounded-lg ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <Link href={route('admin.claims.index')} className="text-sm font-medium text-slate-600 hover:text-slate-800">
                            Back to List
                        </Link>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleSubmit('rejected')}
                                disabled={processing}
                                className="px-6 py-2.5 rounded-lg font-bold text-red-600 border border-red-200 hover:bg-red-50"
                            >
                                Reject Claim
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit('claimed')}
                                disabled={processing}
                                className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                            >
                                {processing ? 'Processing...' : 'Approve Claim'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}