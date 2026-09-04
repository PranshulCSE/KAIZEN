export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'badge-primary',
    accent: 'badge-accent',
    success: 'badge-success',
    danger: 'badge-danger',
    neutral: 'badge-neutral',
    improve: 'badge-accent',
    revise: 'badge-danger'
  };

  return (
    <span className={`${variants[variant] || variants.primary} ${className}`}>
      {children}
    </span>
  );
}
