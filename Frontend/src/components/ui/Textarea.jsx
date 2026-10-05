import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, placeholder, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        placeholder={placeholder}
        className={`input-field resize-none leading-relaxed ${
          error
            ? 'border-rose-500 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5 font-medium animate-slide-down">
          {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
