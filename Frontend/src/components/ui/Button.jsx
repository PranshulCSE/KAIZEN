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
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 border-2 font-body focus:outline-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-pill',
    md: 'px-4 py-2.5 text-sm rounded-pill',
    lg: 'px-6 py-3 text-base rounded-pill',
  };

  const variantStyles = {
    primary: 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 active:bg-primary-800',
    lime: 'bg-lime text-ink border-lime hover:shadow-brutal-lime active:shadow-none',
    secondary: 'bg-paper text-ink border-ink hover:bg-surface active:shadow-brutal-sm',
    ghost: 'bg-transparent text-ink border-transparent hover:bg-surface hover:border-surface',
    accent: 'bg-accent-500 text-white border-accent-500 hover:bg-accent-600 hover:border-accent-600',
    danger: 'bg-danger text-paper border-danger hover:shadow-brutal active:shadow-none',
  };

  const disabledStyles = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <Component
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.secondary} ${disabledStyles} ${className}`}
      disabled={Component === 'button' ? disabled || isLoading : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </Component>
  );
};

export default Button;