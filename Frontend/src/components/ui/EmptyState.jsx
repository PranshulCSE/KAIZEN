import React from 'react';
import { FileQuestion } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FileQuestion,
  title = 'No items found',
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-dark-200 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50 p-10 sm:p-14 text-center flex flex-col items-center justify-center transition-colors ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-dark-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400 flex items-center justify-center mb-4 border border-dark-200/80 dark:border-dark-700/80 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display text-lg font-bold text-dark-900 dark:text-white mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="max-w-md text-xs sm:text-sm text-dark-500 dark:text-dark-400 leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && <div className="animate-fade-in">{action}</div>}
    </div>
  );
}
