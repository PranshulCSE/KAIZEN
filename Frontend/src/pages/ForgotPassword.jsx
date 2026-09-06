import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../assets/Logo.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function ForgotPassword() {
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center items-center p-4 selection:bg-primary-100 selection:text-primary-700">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-block mb-3">
                        <Logo showBadge />
                    </div>
                    <h1 className="text-2xl font-black font-display text-dark-900 tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-xs text-dark-500 mt-1">
                        Enter your registered email and we'll send you recovery instructions.
                    </p>
                </div>

                <Card className="p-8 shadow-xl shadow-dark-900/5 border-dark-200/80">
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

                    <div className="mt-6 pt-6 border-t border-dark-100 text-center">
                        <Link
                            to={ROUTES.LOGIN}
                            className="inline-flex items-center gap-1.5 text-xs text-dark-600 hover:text-primary-600 font-semibold transition-colors"
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
