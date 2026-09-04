import { Loader2 } from 'lucide-react';

const Button = ({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'font-semibold transition-all duration-200 border-2 font-body focus:outline-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-pill',
    md: 'px-4 py-2.5 text-sm rounded-pill',
    lg: 'px-6 py-3 text-base rounded-pill',
  };

  const variantStyles = {
    lime: 'bg-lime text-ink border-lime hover:shadow-brutal-lime active:shadow-none',
    secondary: 'bg-paper text-ink border-ink hover:bg-surface active:shadow-brutal-sm',
    ghost: 'bg-transparent text-ink border-ink hover:bg-surface',
    danger: 'bg-danger text-paper border-danger hover:shadow-brutal active:shadow-none',
  };

  const disabledStyles = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
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
    </button>
  );
};

export default Button;