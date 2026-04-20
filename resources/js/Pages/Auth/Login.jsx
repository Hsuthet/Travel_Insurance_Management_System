import { useEffect, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner'; // Import the toast function
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors, reset, setError, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Automatically show toasts for Laravel Flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        // Simple frontend validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;

        if (!data.email) {
            setError('email', 'Email is required.');
            hasError = true;
        } else if (!emailRegex.test(data.email)) {
            setError('email', 'Please enter a valid email.');
            hasError = true;
        }

        if (!data.password) {
            setError('password', 'Password is required.');
            hasError = true;
        }

        if (hasError) return;

        post(route('login'), {
            onSuccess: () => {
                toast.success('Login successful!', {
                    description: 'Redirecting to your dashboard...',
                });
            },
            onError: () => {
                toast.error('Login failed', {
                    description: 'Please check your email and password.',
                });
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#D9E7F9] px-4 font-sans">
            <Head title="Log in" />

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white shadow-2xl overflow-hidden rounded-[40px] border-[3px] border-[#3B82F6]">
                <h2 className="text-3xl font-extrabold text-center text-[#3B82F6] mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8 text-sm">Please enter your details to sign in</p>

                {/* Specific Backend Errors (e.g., Rate Limiting) */}
                {Object.keys(errors).length > 0 && !errors.email && !errors.password && (
                    <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-bold">Authentication failed.</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5" noValidate>
                    <div className="space-y-1">
                        <div className={`relative group transition-all duration-200 ${errors.email ? 'ring-2 ring-rose-500 rounded-2xl' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className={`h-5 w-5 transition-colors ${errors.email ? 'text-rose-500' : 'text-gray-400 group-focus-within:text-[#3B82F6]'}`} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                value={data.email}
                                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-600 font-bold ml-3 italic" />
                    </div>

                    <div className="space-y-1">
                        <div className={`relative group transition-all duration-200 ${errors.password ? 'ring-2 ring-rose-500 rounded-2xl' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-rose-500' : 'text-gray-400 group-focus-within:text-[#3B82F6]'}`} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={data.password}
                                className="block w-full pl-11 pr-12 py-4 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-1 text-xs text-rose-600 font-bold ml-3 italic" />
                    </div>

                    <div className="flex items-center justify-between px-2 pt-1">
                        <label htmlFor="remember" className="flex items-center cursor-pointer group">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-[#3B82F6] shadow-sm focus:ring-[#3B82F6]"
                            />
                            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-bold text-[#3B82F6] hover:text-blue-700 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#3B82F6] text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /><span>Signing in...</span></>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}