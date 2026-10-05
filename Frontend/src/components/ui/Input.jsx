import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-dark-400 dark:text-dark-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-10' : ''} ${
            error
              ? 'border-rose-500 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5 font-medium animate-slide-down">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
