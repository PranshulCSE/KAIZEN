// The signature visual of the whole app: a resume line shown the way an
// editor would mark it up — the old wording struck through in red-pen ink,
// the improved wording underlined in the "improve" color, exactly like a
// hand-corrected manuscript page. Used both on the marketing landing page
// (with static demo copy) and on the real optimize-results page (with
// actual beforeAfter pairs returned by the AI).
export default function RedlineDiff({ before, after, animate = false }) {
  return (
    <div className="group relative flex flex-col gap-2.5 overflow-hidden rounded-md border border-line bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:border-ink/15">
      <span className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-full bg-danger/[0.04]" />
      <p className="relative text-sm leading-relaxed text-ink-muted">
        <span className="relative inline-block">
          {before}
          <span
            className={`absolute left-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-danger ${
              animate ? 'animate-strike' : 'w-full'
            }`}
          />
        </span>
      </p>
      <p className="relative text-sm leading-relaxed text-ink">
        <span className="border-b-2 border-improve/50 pb-0.5">{after}</span>
      </p>
    </div>
  );
}
