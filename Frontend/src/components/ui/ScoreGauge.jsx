import { scoreTone } from '../../utils/formatters.js';

const TONE_COLOR = {
  improve: '#0F6B42',
  revise: '#B87A28',
  danger: '#A9291F'
};

export default function ScoreGauge({ score = 0, size = 88, label }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const tone = scoreTone(safeScore);
  const color = TONE_COLOR[tone];
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const isStrong = tone === 'improve' && safeScore >= 80;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative rounded-full ${isStrong ? 'animate-pulse-ring' : ''}`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#DACD9F" strokeWidth="6" fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-medium text-ink">
          {Math.round(safeScore)}
        </div>
      </div>
      {label && <span className="eyebrow">{label}</span>}
    </div>
  );
}
