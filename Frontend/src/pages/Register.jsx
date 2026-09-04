import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, User, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
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
        <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-fade-in">
                <div className="p-8">
                    {/* HEADER */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-gradient mb-2">Get Started</h1>
                        <p className="text-dark-600">Create your free Kaizen account</p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            icon={User}
                            error={errors.name?.message}
                            {...register('name', { required: 'Name is required' })}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email', { required: 'Email is required' })}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="At least 8 characters"
                                error={errors.password?.message}
                                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-12 text-dark-400 hover:text-dark-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded" required />
                            <span className="text-dark-600 text-sm">
                                I agree to the <a href="#" className="text-primary-600 hover:underline">Terms</a> and{' '}
                                <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
                            </span>
                        </label>

                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                            Create Account
                        </Button>
                    </form>

                    {/* FOOTER */}
                    <p className="mt-6 text-center text-dark-600 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
