import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, User, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../assets/Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { authApi } from '../api/auth.api.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDark, toggleTheme } = useTheme();
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
          <h1 className="text-2xl font-black font-display text-dark-900 dark:text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
            Start generating high-converting, ATS-compliant resumes today.
          </p>
        </div>

        <Card className="p-8 shadow-xl shadow-dark-900/5 border-dark-200/80 dark:border-dark-800">
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
                className="absolute right-3.5 top-9 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full mt-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-100 dark:border-dark-800 text-center">
            <p className="text-xs text-dark-500 dark:text-dark-400">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
