import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sun, Moon, ArrowRight, Mail } from 'lucide-react';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Logo from '../assets/Logo.jsx';
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
      toast.success('Email verified successfully.');
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
      toast.success('A new code has been sent to your email.');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not resend the code.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-dark-900 dark:text-dark-100 flex flex-col justify-center items-center p-4 selection:bg-primary-500 selection:text-white relative transition-colors duration-200">
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
            <Logo to={ROUTES.HOME} showBadge />
          </div>
          <h1 className="font-display text-2xl font-black text-dark-900 dark:text-white tracking-tight">
            Check Your Email
          </h1>
          <p className="mt-1 text-xs text-dark-500 dark:text-dark-400">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>

        <Card className="p-8 shadow-xl shadow-dark-900/5 border-dark-200/80 dark:border-dark-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              error={errors.email?.message}
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Verification Code"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="font-mono tracking-[0.3em] text-center text-lg"
              error={errors.otp?.message}
              {...register('otp', {
                required: 'Code is required',
                minLength: { value: 6, message: 'Code must be 6 digits' },
                maxLength: { value: 6, message: 'Code must be 6 digits' }
              })}
            />

            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-full mt-2">
              <span>Verify Email</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-100 dark:border-dark-800 text-center">
            <button
              onClick={handleSubmit(({ email }) => resend(email))}
              disabled={isResending}
              className="text-xs text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors disabled:opacity-50"
            >
              {isResending ? 'Sending…' : "Didn't get a code? Resend Code"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
