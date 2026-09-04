const Card = ({ children, shadow = false, className = '' }) => {
  const shadowClass = shadow ? 'shadow-brutal' : '';

  return (
    <div
      className={`bg-paper border-2 border-ink rounded p-6 ${shadowClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;