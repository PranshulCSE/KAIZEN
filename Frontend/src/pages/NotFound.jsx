import React from 'react';
import { Link } from 'react-router';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Logo from '../assets/Logo.jsx';
import { ROUTES } from '../constants/routes.js';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F8FAFC] dark:bg-[#0B0F19] text-dark-900 dark:text-dark-100 px-6 text-center animate-fade-in transition-colors duration-200">
      <Logo to={ROUTES.HOME} showBadge />

      <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-200/80 dark:border-primary-800 shadow-sm mt-4">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="max-w-md">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          404 Page Not Found
        </p>
        <h1 className="font-display text-3xl font-black text-dark-900 dark:text-white mt-1">
          Lost in the Stack?
        </h1>
        <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-2 leading-relaxed">
          The page you are looking for might have been moved, renamed, or no longer exists.
        </p>
      </div>

      <Button as={Link} to={ROUTES.HOME} variant="primary" className="mt-2">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Button>
    </div>
  );
}
