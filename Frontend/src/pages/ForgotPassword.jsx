import { Mail, ArrowLeft, Send, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../assets/Logo_Wide.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function ForgotPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async ({ email }) => {
        setIsSubmitting(true);
        try {
            await authApi.forgotPassword(email);
            toast.success('If that email exists, a reset link is on its way.');
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Could not send the reset link.'));
        } finally {
            setIsSubmitting(false);
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

            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-block mb-3">
                        <Logo showBadge />
                    </div>
                    <h1 className="text-2xl font-black font-display text-dark-900 dark:text-white tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                        Enter your registered email and we'll send you recovery instructions.
                    </p>
                </div>

                <Card className="p-8 shadow-xl shadow-dark-900/5 border-dark-200/80 dark:border-dark-800">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email', { required: 'Email is required' })}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            className="w-full shadow-md shadow-primary-500/20"
                        >
                            <Send className="w-4 h-4" />
                            <span>Send Reset Link</span>
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-dark-100 dark:border-dark-800 text-center">
                        <Link
                            to={ROUTES.LOGIN}
                            className="inline-flex items-center gap-1.5 text-xs text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to sign in</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
