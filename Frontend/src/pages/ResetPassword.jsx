import { Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../assets/Logo_Wide.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { search } = useLocation();
    const token = new URLSearchParams(search).get('token') || '';
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async ({ password, confirmPassword }) => {
        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setIsSubmitting(true);
        try {
            await authApi.resetPassword({ token, password });
            toast.success('Password updated.');
            navigate(ROUTES.LOGIN);
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Could not reset your password.'));
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
                        Create New Password
                    </h1>
                    <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                        Enter your new password below.
                    </p>
                </div>

                <Card className="p-8 shadow-xl shadow-dark-900/5 border-dark-200/80 dark:border-dark-800">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="relative">
                            <Input
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-9 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword', { required: 'Please confirm your password' })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3.5 top-9 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full mt-2">
                            Reset Password
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
