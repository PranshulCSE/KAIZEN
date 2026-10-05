import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  as: Component = 'button',
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500/30 active:scale-[0.98] select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50';

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs rounded-lg',
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-5 py-2.5 text-sm rounded-xl font-bold',
    xl: 'px-6 py-3 text-base rounded-2xl font-bold',
  };

  const variantStyles = {
    primary:
      'bg-primary-600 hover:bg-primary-500 text-white shadow-sm hover:shadow-md hover:shadow-primary-500/20 active:bg-primary-700 border border-primary-600/20',
    secondary:
      'bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-100 hover:bg-dark-50 dark:hover:bg-dark-700/80 border border-dark-200 dark:border-dark-700 shadow-2xs hover:border-dark-300 dark:hover:border-dark-600',
    outline:
      'bg-transparent text-dark-700 dark:text-dark-200 border border-dark-300 dark:border-dark-700 hover:bg-dark-100/60 dark:hover:bg-dark-800',
    ghost:
      'bg-transparent text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white border border-transparent',
    lime:
      'bg-[#D7FA3B] hover:bg-[#E4FC4D] text-slate-950 font-bold shadow-sm hover:shadow-md active:bg-[#c9ee24] border border-[#c4e825]/40',
    accent:
      'bg-accent-500 hover:bg-accent-600 text-white shadow-sm hover:shadow-md active:bg-accent-700 border border-accent-600/20',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-sm hover:shadow-md hover:shadow-rose-600/20 active:bg-rose-700 border border-rose-600/20',
    success:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-md hover:shadow-emerald-600/20 active:bg-emerald-700 border border-emerald-600/20',
    dark:
      'bg-dark-900 hover:bg-dark-800 text-white dark:bg-dark-100 dark:text-dark-900 dark:hover:bg-white shadow-sm border border-dark-800 dark:border-dark-200',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.secondary;
  const selectedSize = sizeStyles[size] || sizeStyles.md;

  return (
    <Component
      className={`${baseStyles} ${selectedSize} ${selectedVariant} ${className}`}
      disabled={Component === 'button' ? disabled || isLoading : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </Component>
  );
};

export default Button;