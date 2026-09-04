import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-dark-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-12' : ''} ${error ? 'border-danger-500 focus:border-danger-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-danger-600 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
