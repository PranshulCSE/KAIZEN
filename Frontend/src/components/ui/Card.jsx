const Card = ({ children, shadow = false, hover = false, className = '', ...props }) => {
  const shadowClass = shadow ? 'shadow-brutal' : 'shadow-card';
  const hoverClass = hover ? 'hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200' : '';

  return (
    <div
      className={`bg-paper border border-dark-100 rounded-xl p-6 ${shadowClass} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;