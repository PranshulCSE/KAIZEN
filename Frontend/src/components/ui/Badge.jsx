import React from 'react';

export default function Badge({ children, variant, tone, size = 'sm', className = '' }) {
  const key = (tone || variant || 'primary').toLowerCase();

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  const variants = {
    primary:
      'bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200/80 dark:border-primary-800/80',
    accent:
      'bg-accent-50 dark:bg-accent-950/70 text-accent-800 dark:text-accent-300 border border-accent-200/80 dark:border-accent-800/80',
    warning:
      'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80',
    success:
      'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80',
    improve:
      'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-medium',
    danger:
      'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80',
    neutral:
      'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 border border-dark-200/80 dark:border-dark-700',
    secondary:
      'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 border border-dark-200/80 dark:border-dark-700',
    revise:
      'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 font-medium',
    high:
      'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 font-bold',
    medium:
      'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 font-semibold',
    low:
      'bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 font-medium',
    info:
      'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/80',
  };

  const selectedVariant = variants[key] || variants.primary;
  const selectedSize = sizeStyles[size] || sizeStyles.sm;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium tracking-wide transition-all select-none ${selectedSize} ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
