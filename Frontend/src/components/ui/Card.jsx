const Card = ({ children, shadow = false, hover = false, className = '', ...props }) => {
  const shadowClass = shadow ? 'shadow-brutal dark:shadow-[5px_5px_0_0_#1F2937]' : 'shadow-card dark:shadow-none';
  const hoverClass = hover ? 'hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200' : '';

  return (
    <div
      className={`bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 text-dark-900 dark:text-dark-100 rounded-xl p-6 transition-colors ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;