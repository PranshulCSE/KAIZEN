import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Logo from '../assets/Logo_Wide.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function VerifyOtp() {
    const { verifyOtp } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues: { email: location.state?.email || '' } });

    const onSubmit = async ({ email, otp }) => {
        setIsSubmitting(true);
        try {
            await verifyOtp(email, otp);
            toast.success('Email verified.');
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            toast.error(apiErrorMessage(err, 'Invalid or expired code.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const resend = async (email) => {
        if (!email) {
            toast.error('Enter your email first.');
            return;
        }
        setIsResending(true);
        try {
            await authApi.resendOtp(email);
            toast.success('A new code is on its way.');
        } catch (err) {
            toast.error(apiErrorMessage(err, 'Could not resend the code.'));
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F7F2] dark:bg-[#0B0D10] text-dark-900 dark:text-dark-100 flex flex-col justify-center items-center p-4 selection:bg-primary-100 selection:text-primary-700 relative transition-colors duration-200">
            {/* Top right theme toggle */}
            <div className="absolute top-4 right-4">
                <button
                    type="button"
                    onClick={toggleTheme}
                    className="p-2 rounded-xl border border-dark-200/80 dark:border-dark-700 bg-white/80 dark:bg-dark-900/80 text-dark-600 dark:text-dark-300 hover:bg-white dark:hover:bg-dark-800 transition-colors shadow-2xs"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dark-600" />}
                </button>
            </div>

            <div className="w-full max-w-sm animate-fade-up">
                <div className="text-center mb-6">
                    <Link to={ROUTES.HOME} className="inline-block mb-3">
                        <Logo />
                    </Link>
                    <h1 className="font-display text-2xl font-black text-dark-900 dark:text-white">Check your email</h1>
                    <p className="mt-1 text-xs text-dark-500 dark:text-dark-400">Enter the 6-digit verification code we just sent you.</p>
                </div>

                <Card className="p-8 shadow-xl border-dark-200/80 dark:border-dark-800">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <Input
                            label="Email Address"
                            type="email"
                            error={errors.email?.message}
                            {...register('email', { required: 'Email is required' })}
                        />
                        <Input
                            label="Verification Code"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="000000"
                            className="font-mono tracking-[0.3em]"
                            error={errors.otp?.message}
                            {...register('otp', {
                                required: 'Code is required',
                                minLength: { value: 6, message: 'Code must be 6 digits' },
                                maxLength: { value: 6, message: 'Code must be 6 digits' }
                            })}
                        />

                        <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
                            Verify Email
                        </Button>
                    </form>

                    <button
                        onClick={handleSubmit(({ email }) => resend(email))}
                        disabled={isResending}
                        className="mt-5 w-full text-center text-xs text-dark-500 dark:text-dark-400 underline-offset-2 hover:text-dark-900 dark:hover:text-white hover:underline disabled:opacity-50 transition-colors"
                    >
                        {isResending ? 'Sending…' : "Didn't get a code? Resend"}
                    </button>
                </Card>
            </div>
        </div>
    );
}
