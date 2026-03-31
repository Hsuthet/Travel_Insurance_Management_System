import React, { useState } from 'react'; // Added useState
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, ArrowLeft, User, Mail, Shield, Eye, EyeOff } from 'lucide-react'; // Added Eye icons

export default function UserForm({ auth, user = null }) {
    const isEditing = !!user;
    
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'admin', 
        password: '', 
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/users/${user.id}`);
        } else {
            post('/admin/users');
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={isEditing ? 'Edit User' : 'Create User'} />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            {isEditing ? 'Update User Account' : 'Register New User'}
                        </h2>
                        <p className="text-sm text-slate-500">
                            {isEditing ? `Modifying access for ${user.name}` : 'Fill in the details to create a new system administrator.'}
                        </p>
                    </div>
                    <Link 
                        href="/admin/users" 
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back to List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 space-y-6">
                        
                        {/* Name Field */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <User size={16} className="text-blue-500" /> Full Name
                            </label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`w-full border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                                placeholder="e.g. John Doe"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Mail size={16} className="text-blue-500" /> Email Address
                            </label>
                            <input 
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`w-full border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all`}
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Role Field */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Shield size={16} className="text-blue-500" /> System Role
                            </label>
                            <select 
                                value={data.role}
                                onChange={e => setData('role', e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
                            >
                                <option value="admin">Administrator</option>
                                <option value="superadmin">Super Admin</option>
                            </select>
                            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                        </div>

                        <hr className="border-slate-100" />

                        {/* Password Fields with Toggle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">
                                    {isEditing ? 'New Password (Optional)' : 'Password'}
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className={`w-full border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500/20 outline-none`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Confirm Password</label>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                        </div>
                        {isEditing && (
                            <p className="text-[11px] text-slate-400 italic">Leave password blank to keep current password.</p>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-slate-50 px-8 py-4 flex justify-end gap-3 border-t border-slate-100">
                        <Link 
                            href="/admin/users" 
                            className="px-6 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            Cancel
                        </Link>
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 active:scale-95"
                        >
                            <Save size={18} />
                            {isEditing ? 'Update User' : 'Save User'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}