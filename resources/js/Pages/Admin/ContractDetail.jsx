import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function ContractDetail({ contract, auth }) {
    // 1. Add state for the confirmation logic
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

    const planNames = { 1: 'Basic', 2: 'Standard', 3: 'Premium' };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dateString.split('T')[0];
    };

    // 2. The trigger function that opens the modal
    const triggerConfirm = (status) => {
        setPendingStatus(status);
        setShowConfirmModal(true);
    };

    // 3. The final submission function
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
                        <span className={`px-4 py-1 rounded-full text-white font-bold text-sm ${
                            contract.status === 'pending' ? 'bg-orange-400' : 
                            contract.status === 'wait_pay' ? 'bg-blue-400' :
                            contract.status === 'active' ? 'bg-green-500' : 
                            contract.status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                        }`}>
                            {contract.status.toUpperCase().replace('_', ' ')}
                        </span>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Info Card */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2 text-blue-700">Customer Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                <p><span className="font-semibold text-gray-600">Name:</span> {contract.customer?.name}</p>
                                <p><span className="font-semibold text-gray-600">Email:</span> {contract.customer?.email}</p>
                                <p><span className="font-semibold text-gray-600">Phone:</span> {contract.customer?.phone}</p>
                                <p><span className="font-semibold text-gray-600">Date of Birth:</span> {formatDate(contract.customer?.dob)}</p>
                                <p><span className="font-semibold text-gray-600">NRC:</span> {contract.customer?.nrc || 'N/A'}</p>  
                                <p><span className="font-semibold text-gray-600">Passport:</span> {contract.customer?.passport || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Address:</span> {contract.customer?.address || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Occupation:</span> {contract.customer?.occupation || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Gender:</span> {contract.customer?.gender || 'N/A'}</p>                               
                            </div>
                        </section>

                        {/* Travel Info Card */}
                        <section className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2 text-blue-700">Insurance & Travel Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                <p><span className="font-semibold text-gray-600">Policy No:</span> <span className="font-mono text-blue-600">{contract.policy_no || 'NOT GENERATED'}</span></p>
                                <p><span className="font-semibold text-gray-600">Plan:</span> {planNames[contract.plan_id] || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Premium:</span> {Number(contract.premium_amount).toLocaleString()} MMK</p>
                                <p><span className="font-semibold text-gray-600">Trip Type:</span> {contract.trip_type}</p>
                                <p><span className="font-semibold text-gray-600">Destination:</span> {contract.destination}</p>
                                <p><span className="font-semibold text-gray-600">Vehicle:</span> {contract.vehicle || 'N/A'}</p>
                                <p><span className="font-semibold text-gray-600">Start Date:</span> {formatDate(contract.start_date)}</p>
                                <p><span className="font-semibold text-gray-600">End Date:</span> {formatDate(contract.end_date)}</p>
                                <p><span className="font-semibold text-gray-600">Applied On:</span> {formatDate(contract.created_at)}</p>
                            </div>
                        </section>

                        {/* Beneficiary Info */}
                        {contract.beneficiary && (
                            <section className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-fuchsia-400">
                                <h3 className="font-bold text-lg mb-4 border-b pb-2 text-fuchsia-700">Beneficiary Person</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                    <p><span className="font-semibold text-gray-600">Name:</span> {contract.beneficiary.name}</p>
                                    <p><span className="font-semibold text-gray-600">Phone:</span> {contract.beneficiary.phone}</p>
                                    <p><span className="font-semibold text-gray-600">Relationship:</span> {contract.beneficiary.relationship}</p>
                                    <p><span className="font-semibold text-gray-600">NRC:</span> {contract.beneficiary.nrc || 'N/A'}</p>
                                    <p><span className="font-semibold text-gray-600">Passport:</span> {contract.beneficiary.passport || 'N/A'}</p>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Action Buttons */}
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
                                    Approve (Confirm)
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

                {/* 4. The Confirmation Modal (Styled exactly like your Claim page) */}
                {showConfirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                You are about to change this contract status to 
                                <span className={`mx-1 font-bold ${
                                    pendingStatus === 'wait_pay' ? 'text-blue-600' : 
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
                                    className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all ${
                                        pendingStatus === 'wait_pay' ? 'bg-blue-600 hover:bg-blue-700' : 
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