import { Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-fade-in">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-dark-900 mb-2">Create New Password</h1>
                    <p className="text-dark-600 mb-8">Enter your new password below</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                className="absolute right-4 top-12 text-dark-400"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                                className="absolute right-4 top-12 text-dark-400"
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                            Reset Password
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
