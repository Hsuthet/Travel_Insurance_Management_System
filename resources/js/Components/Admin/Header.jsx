import React, { useState } from 'react';
import { Moon, Bell, ChevronDown, LogOut } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react'; 

const Header = () => {
    // 1. Get the authenticated user data from Inertia page props
    const { auth } = usePage().props;
    const user = auth.user;

    // State to toggle the dropdown menu
    const [isOpen, setIsOpen] = useState(false);

    // Format the role to look nice (e.g., superadmin -> Super Admin)
    const formatRole = (role) => {
        if (!role) return 'User';
        return role.charAt(0).toUpperCase() + role.slice(1).replace('admin', ' Admin');
    };

    return (
        <header className="h-20 bg-white border-b border-blue-100 px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Left Side */}
            <div>
                <h2 className="text-2xl font-bold text-blue-600">
                    Welcome Back, {user?.name.split(' ')[0]}!
                </h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Travel Insurance System Portal
                </p>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-6">
                {/* User Dropdown Container */}
                <div className="relative">
                    <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-blue-200 overflow-hidden">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=DBEAFE&color=2563EB&bold=true`} 
                                alt="profile" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-slate-700 leading-none">
                                    {user?.name || 'Guest'}
                                </span>
                                <ChevronDown 
                                    size={14} 
                                    className={`text-slate-400 group-hover:text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                                />
                            </div>
                            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tight">
                                {formatRole(user?.role)}
                            </span>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <>
                            {/* Backdrop to close dropdown when clicking outside */}
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Logged in as</p>
                                    <p className="text-xs font-medium text-slate-600 truncate">{user?.email}</p>
                                </div>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;