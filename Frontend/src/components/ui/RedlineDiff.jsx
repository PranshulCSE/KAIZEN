import React from 'react';

export default function RedlineDiff({ before, after, animate = false }) {
  return (
    <div className="group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border border-dark-200/80 dark:border-dark-800 bg-white dark:bg-dark-900 p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card hover:border-dark-300 dark:hover:border-dark-700">
      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
        <span>✕</span>
        <span>Original Wording</span>
      </div>
      <p className="text-xs sm:text-sm leading-relaxed text-dark-500 dark:text-dark-400 line-through">
        {before}
      </p>

      <div className="pt-2 border-t border-dark-100 dark:border-dark-800">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <span>✓</span>
          <span>ATS High-Impact Revision</span>
        </div>
        <p className="text-xs sm:text-sm font-semibold leading-relaxed text-dark-900 dark:text-white">
          {after}
        </p>
      </div>
    </div>
  );
}
