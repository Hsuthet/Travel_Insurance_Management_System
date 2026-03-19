import React from 'react';
import { Moon, Bell, ChevronDown } from 'lucide-react';

const Header = ({ userName = "Guest" }) => {
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

                {/* User Dropdown */}
                <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer group">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-blue-200 overflow-hidden">
                        <img 
                            // This API generates an avatar using the actual user's name
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=DBEAFE&color=2563EB&bold=true`} 
                            alt="profile" 
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-slate-700 leading-none">{userName}</span>
                            <ChevronDown size={14} className="text-slate-400 group-hover:text-blue-600 transition" />
                        </div>
                        <span className="text-[10px] text-blue-500 font-bold uppercase">Administrator</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;