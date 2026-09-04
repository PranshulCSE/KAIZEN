export default function StepMarker({ number, title, description, isLast = false }) {
  return (
    <div className="group flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink font-mono text-sm text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-paper">
          {number}
        </span>
        {!isLast && <span className="mt-1 w-px flex-1 bg-line" />}
      </div>
      <div className="pb-10">
        <h3 className="font-display text-lg text-ink">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p>
      </div>
    </div>
  );
}
