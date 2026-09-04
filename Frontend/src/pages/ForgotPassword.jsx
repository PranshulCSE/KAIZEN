import { Mail, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';

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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md animate-fade-in">
                <div className="p-8">
                    <Link to="/login" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to login
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-dark-900 mb-2">Reset Password</h1>
                        <p className="text-dark-600">Enter your email and we'll send you a link to reset your password</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            icon={Mail}
                            error={errors.email?.message}
                            {...register('email', { required: 'Email is required' })}
                        />

                        <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full">
                            Send Reset Link
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
