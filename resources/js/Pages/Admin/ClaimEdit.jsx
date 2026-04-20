import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, Head, useForm, Link } from '@inertiajs/react';

export default function ClaimEdit({ auth, claim }) {
    const [showRejectBox, setShowRejectBox] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingclaim_status, setPendingclaim_status] = useState(null);
    const [rejectError, setRejectError] = useState('');

    const isReadOnly = claim.claim_status !== 'pending';

    const planDetails = {
        '1': { name: 'Basic', amount: 25000, coverage: 'Medical Only' },
        '2': { name: 'Standard', amount: 50000, coverage: 'Medical + Trip Cancellation' },
        '3': { name: 'Premium', amount: 300000, coverage: 'Standard + Death Benefit' },
    };

    const { data, setData, processing, errors } = useForm({
        policy_no: claim.policy_no || '',
        full_name: claim.full_name || '',
        email: claim.email || '',
        phone: claim.phone || '',
        plan_id: claim.plan_id ? String(claim.plan_id) : '',
        accident_date: claim.accident_date ? claim.accident_date.substring(0, 10) : '',
        claim_amount: claim.claim_amount || '',
        description: claim.accident_description || '',
        claim_status: claim.claim_status || 'pending',
        reject_reason: claim.reject_reason || '',
    });

    const handlePlanChange = (e) => {
        if (isReadOnly) return;
        const selectedId = e.target.value;
        setData((prev) => ({
            ...prev,
            plan_id: selectedId,
            claim_amount: planDetails[selectedId]?.amount || ''
        }));
    };

    const triggerConfirm = (claim_status) => {
        if (claim_status === 'rejected' && !data.reject_reason.trim()) {
            setRejectError('Please provide a reason for rejection.');
            return;
        }
        setRejectError('');
        setPendingclaim_status(claim_status);
        setShowConfirmModal(true);
    };

    const handleFinalSubmit = () => {
        setShowConfirmModal(false);
        router.patch(route('claims.claim_status', { id: claim.claim_id }), {
            claim_status: pendingclaim_status,
            plan_id: data.plan_id,
            claim_amount: data.claim_amount,
            reject_reason: data.reject_reason
        });
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={isReadOnly ? "View Claim" : "Edit Claim"} />
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 mt-10 relative">
                <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isReadOnly ? 'View Claim Details' : 'Edit & Review Claim'}
                        </h1>
                        <p className="text-slate-500 font-medium italic">
                            Current claim_status: <span className="font-bold uppercase text-blue-600">{claim.claim_status}</span>
                        </p>
                    </div>
                </div>

                <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Policy Number</label>
                            <input type="text" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" value={data.policy_no} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Customer Full Name</label>
                            <input type="text" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" value={data.full_name} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Insurance Plan</label>
                            <select
                                className={`w-full rounded-lg ${isReadOnly ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' : 'border-slate-300 focus:ring-indigo-500'}`}
                                value={data.plan_id}
                                onChange={handlePlanChange}
                                disabled={isReadOnly}
                            >
                                <option value="">-- Plan --</option>
                                <option value="1">Basic </option>
                                <option value="2">Standard </option>
                                <option value="3">Premium </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Claimed Amount (MMK)</label>
                            <input
                                type="text"
                                readOnly
                                className="w-full bg-slate-50 border-slate-200 rounded-lg text-indigo-600 font-bold cursor-not-allowed"
                                value={data.claim_amount ? Number(data.claim_amount).toLocaleString() : '0'}
                            />
                        </div>
                    </div>

                    {data.plan_id && (
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg animate-in fade-in slide-in-from-left-2">
                            <h4 className="text-sm font-bold text-indigo-800 underline mb-1">Plan Coverage: {planDetails[data.plan_id].name}</h4>
                            <p className="text-sm text-indigo-700 leading-relaxed">
                                Benefit: <strong>{planDetails[data.plan_id].coverage}</strong>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Accident</label>
                            <input
                                type="date"
                                className={`w-full rounded-lg ${isReadOnly ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' : errors.accident_date ? 'border-red-500' : 'border-slate-300'}`}
                                value={data.accident_date}
                                onChange={e => !isReadOnly && setData('accident_date', e.target.value)}
                                readOnly={isReadOnly}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                            <input type="text" readOnly className="w-full bg-slate-50 border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" value={data.phone} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Claim Description</label>
                        <textarea
                            rows="3"
                            className={`w-full rounded-lg ${isReadOnly ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed' : errors.description ? 'border-red-500' : 'border-slate-300'}`}
                            value={data.description}
                            onChange={e => !isReadOnly && setData('description', e.target.value)}
                            readOnly={isReadOnly}
                        ></textarea>
                    </div>

                    {(showRejectBox || (claim.claim_status === 'rejected' && data.reject_reason)) && (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-red-700 mb-2">Rejection Reason</label>
                            <textarea
                                rows="3"
                                className={`w-full rounded-lg ${isReadOnly ? 'bg-white border-red-100 text-red-800' : 'border-red-200 focus:ring-red-500'} ${rejectError ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                placeholder="Explain why this claim is being rejected..."
                                value={data.reject_reason}
                                onChange={e => {
                                    setData('reject_reason', e.target.value);
                                    if (rejectError) setRejectError('');
                                }}
                                readOnly={isReadOnly}
                            ></textarea>
                            {rejectError && (
                                <p className="mt-1 text-xs font-bold text-red-600 animate-pulse">
                                    ⚠️ {rejectError}
                                </p>
                            )}
                            {!isReadOnly && showRejectBox && (
                                <div className="mt-3 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => triggerConfirm('rejected')}
                                        className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-red-700 transition-colors"
                                    >
                                        Confirm Rejection
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowRejectBox(false);
                                            setRejectError('');
                                        }}
                                        className="text-slate-600 px-4 py-1.5 text-sm hover:underline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                        <Link href={route('claims.index')} className="text-sm font-medium text-slate-600 hover:text-slate-800">Back to List</Link>
                        {!isReadOnly && (
                            <div className="flex gap-4">
                                {!showRejectBox && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setShowRejectBox(true)}
                                            disabled={processing}
                                            className="px-6 py-2.5 rounded-lg font-bold text-red-600 border border-red-200 hover:bg-red-50"
                                        >
                                            Reject Claim
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => triggerConfirm('claimed')}
                                            disabled={processing}
                                            className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 shadow-lg"
                                        >
                                            Approve Claim
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </form>

                {showConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                You are marking this claim as
                                <span className={`mx-1 font-bold ${pendingclaim_status === 'claimed' ? 'text-green-600' : 'text-red-600'}`}>
                                    {pendingclaim_status === 'claimed' ? 'APPROVED' : 'REJECTED'}
                                </span>
                                for a total of <strong>{Number(data.claim_amount).toLocaleString()} MMK</strong>.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFinalSubmit}
                                    className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all ${
                                        pendingclaim_status === 'claimed' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}