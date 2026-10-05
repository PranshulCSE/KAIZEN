import React from 'react';

export default function StepMarker({ number, title, description, isLast = false }) {
  return (
    <div className="group flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary-300 dark:border-primary-800 bg-primary-50 dark:bg-primary-950 font-mono text-xs font-bold text-primary-700 dark:text-primary-300 transition-colors duration-200 group-hover:bg-primary-600 group-hover:text-white shadow-2xs">
          {number}
        </span>
        {!isLast && (
          <span className="mt-2 w-px flex-1 bg-dark-200 dark:bg-dark-800" />
        )}
      </div>
      <div className="pb-8">
        <h3 className="font-display text-base font-bold text-dark-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="mt-1 max-w-md text-xs sm:text-sm text-dark-500 dark:text-dark-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
