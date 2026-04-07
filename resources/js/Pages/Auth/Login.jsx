import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox'; // Assuming you have this standard Breeze component

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#D9E7F9] px-4">
            <Head title="Log in" />

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white shadow-2xl overflow-hidden rounded-[40px] border-[3px] border-[#3B82F6]">
                <h2 className="text-3xl font-extrabold text-center text-[#3B82F6] mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8 text-sm">Please enter your details to sign in</p>

                {status && <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg text-center">{status}</div>}

                <form onSubmit={submit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                value={data.email}
                                className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="ml-2" />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#3B82F6] transition-colors" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={data.password}
                                className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="ml-2" />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between px-2">
                        <label className="flex items-center cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-[#3B82F6] hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    {/* Login Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#3B82F6] text-white font-bold py-3.5 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {processing && <Loader2 className="h-5 w-5 animate-spin" />}
                            {processing ? 'Logging in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}