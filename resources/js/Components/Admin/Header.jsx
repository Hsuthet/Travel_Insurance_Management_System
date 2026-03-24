import React, { useState } from 'react'; // Added useState
import { Moon, Bell, ChevronDown, LogOut } from 'lucide-react'; // Added LogOut icon
import { Link } from '@inertiajs/react'; // Import Link from Inertia

const Header = ({ userName = "Guest" }) => {
    // State to toggle the dropdown menu
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="h-20 bg-white border-b border-blue-100 px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Left Side */}
            <div>
                <h2 className="text-2xl font-bold text-blue-600">
                    Welcome Back!
                </h2>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Travel Insurance System Portal
                </p>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <button className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-100 transition">
                        <Moon size={20} />
                    </button>
                    <button className="p-2 bg-blue-50 text-blue-400 rounded-full hover:bg-blue-100 transition relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                {/* User Dropdown Container */}
                <div className="relative">
                    <div 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-blue-200 overflow-hidden">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=DBEAFE&color=2563EB&bold=true`} 
                                alt="profile" 
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-slate-700 leading-none">{userName}</span>
                                <ChevronDown 
                                    size={14} 
                                    className={`text-slate-400 group-hover:text-blue-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                                />
                            </div>
                            <span className="text-[10px] text-blue-500 font-bold uppercase">Administrator</span>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <>
                            {/* Backdrop to close dropdown when clicking outside */}
                            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
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