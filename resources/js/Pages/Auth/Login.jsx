import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
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
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#D9E7F9]">
            <Head title="Log in" />

            <div className="w-full sm:max-w-md mt-6 px-10 py-12 bg-white shadow-xl overflow-hidden rounded-[40px] border-[3px] border-[#3B82F6]">
                <h2 className="text-3xl font-bold text-center text-[#3B82F6] mb-8">Log In</h2>

                {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                <form onSubmit={submit} className="space-y-5">
                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Email"
                            value={data.email}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter Password"
                            value={data.password}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Login Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-white border-2 border-[#3B82F6] text-[#3B82F6] font-semibold py-2.5 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50"
                        >
                            Login
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-center">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}