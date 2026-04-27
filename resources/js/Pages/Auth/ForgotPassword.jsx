import { Head, useForm } from '@inertiajs/react';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#D9E7F9] px-4 font-sans">
            <Head title="Forgot Password" />

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white shadow-2xl overflow-hidden rounded-[40px] border-[3px] border-[#3B82F6]">
                <Link 
                    href={route('login')} 
                    className="inline-flex items-center text-sm text-[#3B82F6] font-bold mb-6 hover:gap-2 transition-all"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                </Link>

                <h2 className="text-3xl font-extrabold text-[#3B82F6] mb-2">Forgot Password?</h2>
                <p className="text-gray-500 mb-8 text-sm">
                    No problem. Just let us know your email address and we will email you a password reset link.
                </p>

                {status && (
                    <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-1">
                        <div className={`relative group transition-all duration-200 ${errors.email ? 'ring-2 ring-rose-500 rounded-2xl' : ''}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className={`h-5 w-5 ${errors.email ? 'text-rose-500' : 'text-gray-400 group-focus-within:text-[#3B82F6]'}`} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1 text-xs text-rose-600 font-bold ml-3 italic" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#3B82F6] text-white font-bold py-4 rounded-2xl hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <><Loader2 className="h-5 w-5 animate-spin" /> Sending Link...</>
                        ) : (
                            'Email Password Reset Link'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}