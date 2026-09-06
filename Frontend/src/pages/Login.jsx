import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../assets/Logo.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { apiErrorMessage } from '../api/axiosClient.js';
import { ROUTES } from '../constants/routes.js';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Welcome back to Kaizen!');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Could not sign you in.'));
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
            Welcome Back
          </h1>
          <p className="text-xs text-dark-500 mt-1">
            Sign in to access your resumes and ATS optimization tools.
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

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-dark-600">
                <input type="checkbox" className="rounded border-dark-300 text-primary-600 focus:ring-primary-500" />
                <span>Remember me</span>
              </label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary-600 hover:text-primary-700 font-semibold">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full shadow-md shadow-primary-500/20 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-100 text-center">
            <p className="text-xs text-dark-500">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-primary-600 hover:text-primary-700 font-bold">
                Create one free
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
