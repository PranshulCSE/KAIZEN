import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Logo from '../assets/Logo.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function VerifyOtp() {
    const { verifyOtp } = useAuth();
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
        <div className="bg-manuscript flex min-h-screen items-center justify-center bg-paper px-6">
            <div className="w-full max-w-sm animate-fade-up rounded-lg border border-line bg-surface p-8 shadow-lift">
                <Link to={ROUTES.HOME} className="mb-8 inline-block text-ink">
                    <Logo />
                </Link>

                <h1 className="font-display text-2xl text-ink">Check your email</h1>
                <p className="mt-1 text-sm text-ink-muted">Enter the 6-digit code we just sent you.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
                    <Input
                        label="Email"
                        type="email"
                        error={errors.email?.message}
                        {...register('email', { required: 'Email is required' })}
                    />
                    <Input
                        label="Verification code"
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
                        Verify email
                    </Button>
                </form>

                <button
                    onClick={handleSubmit(({ email }) => resend(email))}
                    disabled={isResending}
                    className="mt-4 w-full text-center text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline disabled:opacity-50"
                >
                    {isResending ? 'Sending…' : "Didn't get a code? Resend"}
                </button>
            </div>
        </div>
    );
}
