import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../assets/Logo.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            await authApi.register({ name: values.name, email: values.email, password: values.password });
            toast.success('Check your email for the verification code.');
            navigate(ROUTES.VERIFY_OTP, { state: { email: values.email } });
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Could not create your account.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center items-center p-4 selection:bg-primary-100 selection:text-primary-700">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-block mb-3">
                        <Logo showBadge />
                    </div>
                    <h1 className="text-2xl font-black font-display text-dark-900 tracking-tight">
                        Create Your Account
                    </h1>
                    <p className="text-xs text-dark-500 mt-1">
                        Start generating high-converting, ATS-proof resumes today.
                    </p>
                </div>

                <Card className="p-8 shadow-xl shadow-dark-900/5 border-dark-200/80">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Alex Morgan"
                            icon={User}
                            error={errors.name?.message}
                            {...register('name', { required: 'Name is required' })}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="alex@example.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email', { required: 'Email is required' })}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                icon={Lock}
                                error={errors.password?.message}
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Must be at least 8 characters' }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-9 text-dark-400 hover:text-dark-600 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            className="w-full shadow-md shadow-primary-500/20 mt-2"
                        >
                            <span>Create Free Account</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-dark-100 text-center">
                        <p className="text-xs text-dark-500">
                            Already have an account?{' '}
                            <Link to={ROUTES.LOGIN} className="text-primary-600 hover:text-primary-700 font-bold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
