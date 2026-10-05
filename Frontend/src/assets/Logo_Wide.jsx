import React from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../constants/routes.js';

export default function LogoWide({ className = '', to = ROUTES.HOME }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 group select-none ${className}`}>
      <img
        src="/Logo_Black.png"
        alt="Kaizen"
        className="h-10 w-auto dark:hidden object-contain transition-transform duration-200 group-hover:scale-105"
      />
      <img
        src="/Logo_White.png"
        alt="Kaizen"
        className="h-10 w-auto hidden dark:block object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </Link>
  );
}
