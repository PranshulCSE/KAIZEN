export default function Badge({ children, variant, tone, className = '' }) {
  // Support both variant and tone props
  const key = tone || variant || 'primary';
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border border-primary-200/60',
    accent: 'bg-accent-100 text-accent-700 border border-accent-200/60',
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200/60',
    danger: 'bg-rose-100 text-rose-700 border border-rose-200/60',
    neutral: 'bg-dark-100 text-dark-700 border border-dark-200/60',
    improve: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium',
    revise: 'bg-amber-100 text-amber-800 border border-amber-300 font-medium',
    high: 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold',
    medium: 'bg-amber-100 text-amber-800 border border-amber-300 font-medium',
    low: 'bg-blue-100 text-blue-800 border border-blue-300 font-medium',
  };

  const selected = variants[key] || variants.primary;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide transition-all ${selected} ${className}`}>
      {children}
    </span>
  );
}
