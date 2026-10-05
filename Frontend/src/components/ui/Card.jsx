import React from 'react';

const Card = ({ children, shadow = false, hover = false, className = '', ...props }) => {
  const shadowClass = shadow
    ? 'shadow-md shadow-dark-900/5 dark:shadow-dark-950/40'
    : 'shadow-2xs dark:shadow-none';

  const hoverClass = hover
    ? 'hover:-translate-y-0.5 hover:shadow-lift hover:border-dark-300/80 dark:hover:border-dark-700 transition-all duration-200'
    : '';

  return (
    <div
      className={`bg-white dark:bg-dark-900 border border-dark-200/80 dark:border-dark-800 text-dark-900 dark:text-dark-100 rounded-2xl p-6 transition-colors duration-200 ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;