export default function EmptyState({ title, description, action }) {
  return (
    <div className="bg-manuscript flex flex-col items-center gap-3 rounded-md border border-dashed border-line py-16 text-center">
      <h3 className="font-display text-lg text-ink">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action}
    </div>
  );
}
