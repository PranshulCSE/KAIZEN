import React from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../constants/routes.js';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Logo({ className = '', iconOnly = false, showBadge = false, to = ROUTES.DASHBOARD }) {
  const { isDark } = useTheme();

  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Dynamic Image with absolute path */}
      <div className="relative flex items-center justify-center">
        <img
          src="/Logo_Black.png"
          alt="Kaizen"
          className="h-9 w-auto dark:hidden object-contain transition-transform duration-200 group-hover:scale-105"
        />
        <img
          src="/Logo_White.png"
          alt="Kaizen"
          className="h-9 w-auto hidden dark:block object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-xl tracking-tight text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              Kaizen
            </span>
            {showBadge && (
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800">
                PRO
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono font-semibold tracking-wider text-dark-400 dark:text-dark-500 -mt-1 uppercase">
            Resume Optimizer
          </span>
        </div>
      )}
    </Link>
  );
}
