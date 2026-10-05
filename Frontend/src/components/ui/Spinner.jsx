import React from 'react';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  return (
    <svg
      className={`animate-spin text-primary-600 dark:text-primary-400 ${sizes[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      ></circle>
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function PageLoader({ label = 'Loading...', fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3.5 text-center animate-fade-in ${
        fullScreen ? 'min-h-screen' : 'py-20 min-h-[350px]'
      }`}
    >
      <div className="relative">
        <Spinner size="lg" />
        <div className="absolute -inset-2 bg-primary-500/10 rounded-full blur-md pointer-events-none" />
      </div>
      <p className="text-xs sm:text-sm font-semibold text-dark-600 dark:text-dark-400 font-mono tracking-wide">
        {label}
      </p>
    </div>
  );
}
