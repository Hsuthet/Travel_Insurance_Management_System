import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function ContractDetail({ contract, auth }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

    const planNames = { 1: 'Basic', 2: 'Standard', 3: 'Premium' };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dateString.split('T')[0];
    };

    const triggerConfirm = (status) => {
        setPendingStatus(status);
        setShowConfirmModal(true);
    };

    const handleFinalSubmit = () => {
        setShowConfirmModal(false);
        router.put(route('contracts.update-status', contract.contract_id), {
            status: pendingStatus
        });
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Contract Details" />

            <div className="p-8 max-w-[1200px] mx-auto relative">
                <div className="bg-[#D9E7F9] rounded-2xl p-6 shadow-sm">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Contract Details</h2>
                        <span className={`px-4 py-1 rounded-full text-white font-bold text-sm ${contract.status === 'pending' ? 'bg-orange-400' :
                                contract.status === 'wait_pay' ? 'bg-blue-400' :
                                    contract.status === 'active' ? 'bg-green-500' :
                                        contract.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                            }`}>
                            {contract.status.toUpperCase().replace('_', ' ')}
                        </span>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Info Card */}
                        <section className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-indigo-400">
                            <h3 className="text-indigo-600 font-bold uppercase text-xs tracking-wider mb-4">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                <p><span className="font-semibold text-gray-500">Name:</span> <span className="text-slate-700">{contract.customer?.name}</span></p>
                                <p><span className="font-semibold text-gray-500">Email:</span> <span className="text-slate-700">{contract.customer?.email}</span></p>
                                <p><span className="font-semibold text-gray-500">Phone:</span> <span className="text-slate-700">{contract.customer?.phone}</span></p>
                                <p><span className="font-semibold text-gray-500">Date of Birth:</span> <span className="text-slate-700">{formatDate(contract.customer?.dob)}</span></p>
                                <p><span className="font-semibold text-gray-500">NRC:</span> <span className="text-slate-700">{contract.customer?.nrc || 'N/A'}</span></p>
                                <p><span className="font-semibold text-gray-500">Passport:</span> <span className="text-slate-700">{contract.customer?.passport || 'N/A'}</span></p>
                                <p><span className="font-semibold text-gray-500">Address:</span> <span className="text-slate-700">{contract.customer?.address || 'N/A'}</span></p>
                                <p><span className="font-semibold text-gray-500">Occupation:</span> <span className="text-slate-700">{contract.customer?.occupation || 'N/A'}</span></p>
                                <p><span className="font-semibold text-gray-500">Gender:</span> <span className="text-slate-700">{contract.customer?.gender || 'N/A'}</span></p>
                            </div>
                        </section>

                        {/* Travel Info Card */}
                        <section className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-teal-400">
                            <h3 className="text-teal-600 font-bold uppercase text-xs tracking-wider mb-4">Travel Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                <p><span className="font-semibold text-gray-500">Policy No:</span> <span className="font-mono font-bold text-blue-600">{contract.policy_no || 'NOT GENERATED'}</span></p>
                                <p><span className="font-semibold text-gray-500">Plan:</span> <span className="text-slate-700">{planNames[contract.plan_id] || 'N/A'}</span></p>
                                <p><span className="font-semibold text-gray-500">Premium:</span> <span className="text-slate-700">{Number(contract.premium_amount).toLocaleString()} MMK</span></p>
                                <p><span className="font-semibold text-gray-500">Trip Type:</span> <span className="text-slate-700">{contract.trip_type}</span></p>
                                <p><span className="font-semibold text-gray-500">Destination:</span> <span className="text-slate-700">{contract.destination}</span></p>
                                <p><span className="font-semibold text-gray-500">Vehicle:</span> <span className="text-slate-700">{contract.vehicle || 'N/A'}</span></p>
                                <p><span className="font-semibold text-gray-500">Start Date:</span> <span className="text-slate-700">{formatDate(contract.start_date)}</span></p>
                                <p><span className="font-semibold text-gray-500">End Date:</span> <span className="text-slate-700">{formatDate(contract.end_date)}</span></p>
                                <p><span className="font-semibold text-gray-500">Applied On:</span> <span className="text-slate-700">{formatDate(contract.created_at)}</span></p>
                            </div>
                        </section>

                        {/* Beneficiary Card */}
                        {contract.beneficiary && (
                            <section className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-fuchsia-400">
                                <h3 className="text-fuchsia-600 font-bold uppercase text-xs tracking-wider mb-4">Beneficiary Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                    <p><span className="font-semibold text-gray-500">Name:</span> <span className="text-slate-700">{contract.beneficiary.name}</span></p>
                                    <p><span className="font-semibold text-gray-500">Phone:</span> <span className="text-slate-700">{contract.beneficiary.phone}</span></p>
                                    <p><span className="font-semibold text-gray-500">Relationship:</span> <span className="text-slate-700">{contract.beneficiary.relationship}</span></p>
                                    <p><span className="font-semibold text-gray-500">NRC:</span> <span className="text-slate-700">{contract.beneficiary.nrc || 'N/A'}</span></p>
                                    <p><span className="font-semibold text-gray-500">Passport:</span> <span className="text-slate-700">{contract.beneficiary.passport || 'N/A'}</span></p>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        {contract.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => triggerConfirm('rejected')}
                                    className="bg-red-500 hover:bg-red-600 text-white px-10 py-2 rounded-xl font-bold shadow-md transition"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => triggerConfirm('wait_pay')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition"
                                >
                                    Approve
                                </button>
                            </>
                        )}

                        {contract.status === 'active' && (
                            <button
                                onClick={() => triggerConfirm('canceled')}
                                className="bg-gray-700 hover:bg-black text-white px-10 py-2 rounded-xl font-bold shadow-md transition"
                            >
                                Cancel Contract
                            </button>
                        )}

                        <button
                            onClick={() => window.history.back()}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-10 py-2 rounded-xl font-bold shadow-md transition"
                        >
                            Back
                        </button>
                    </div>
                </div>

                {showConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                You are about to change this contract status to
                                <span className={`mx-1 font-bold ${pendingStatus === 'wait_pay' ? 'text-blue-600' :
                                        pendingStatus === 'rejected' ? 'text-red-600' : 'text-gray-700'
                                    }`}>
                                    {(pendingStatus === 'wait_pay' ? 'Waiting Payment' : pendingStatus)?.toUpperCase()}
                                </span>.
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
                                    className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all ${pendingStatus === 'wait_pay' ? 'bg-blue-600 hover:bg-blue-700' :
                                            pendingStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800'
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