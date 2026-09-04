import { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, placeholder, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-dark-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        placeholder={placeholder}
        className={`input-field resize-none ${error ? 'border-danger-500 focus:border-danger-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-danger-600 text-sm mt-1.5 font-medium">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
