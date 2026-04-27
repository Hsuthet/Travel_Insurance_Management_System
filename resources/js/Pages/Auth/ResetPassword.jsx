import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import InputError from '@/Components/InputError';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        clearErrors();

        post(route('password.store'), {
            onSuccess: () => {
                toast.success('Password reset successful!', {
                    description: 'You can now sign in with your new password.',
                });
            },
            onError: (errors) => {
                toast.error('Reset failed', {
                    description: 'Please check the form for errors.',
                });
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#D9E7F9] px-4 font-sans">
            <Head title="Reset Password" />

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white shadow-2xl overflow-hidden rounded-[40px] border-[3px] border-[#3B82F6]">
                <div className="flex justify-center mb-4">
                    <div className="bg-blue-50 p-3 rounded-full">
                        <ShieldCheck className="h-8 w-8 text-[#3B82F6]" />
                    </div>
                </div>
                
                <h2 className="text-3xl font-extrabold text-center text-[#3B82F6] mb-2">Set New Password</h2>
                <p className="text-center text-gray-500 mb-8 text-sm">Create a strong password to secure your account</p>

                {/* Specific Backend Errors */}
                {Object.keys(errors).length > 0 && !errors.email && !errors.password && (
                    <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-bold">Could not reset password.</p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5" noValidate>
                    {/* Email Field (Disabled/Read-only usually) */}
                    <div className="space-y-1">
                        <div className={`relative group transition-all duration-200 ${errors.email ? 'ring-2 ring-rose-500 rounded-2xl' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className={`h-5 w-5 ${errors.email ? 'text-rose-500' : 'text-gray-400'}`} />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                readOnly
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-600 font-bold ml-3 italic" />
                    </div>

                    {/* New Password Field */}
                    <div className="space-y-1">
                        <div className={`relative group transition-all duration-200 ${errors.password ? 'ring-2 ring-rose-500 rounded-2xl' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className={`h-5 w-5 transition-colors ${errors.password ? 'text-rose-500' : 'text-gray-400 group-focus-within:text-[#3B82F6]'}`} />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={data.password}
                                className="block w-full pl-11 pr-12 py-4 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
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

                    {/* Confirm Password Field */}
                    <div className="space-y-1">
                        <div className={`relative group transition-all duration-200 ${errors.password_confirmation ? 'ring-2 ring-rose-500 rounded-2xl' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className={`h-5 w-5 transition-colors ${errors.password_confirmation ? 'text-rose-500' : 'text-gray-400 group-focus-within:text-[#3B82F6]'}`} />
                            </div>
                            <input
                                id="password_confirmation"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={data.password_confirmation}
                                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-1 text-xs text-rose-600 font-bold ml-3 italic" />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#3B82F6] text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <><Loader2 className="h-5 w-5 animate-spin" /><span>Updating Password...</span></>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}