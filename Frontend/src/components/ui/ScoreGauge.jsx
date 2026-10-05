import React from 'react';
import { scoreTone } from '../../utils/formatters.js';

const TONE_COLORS = {
  improve: '#10B981', // emerald-500
  revise: '#F59E0B',  // amber-500
  danger: '#EF4444',  // rose-500
};

export default function ScoreGauge({ score = 0, size = 88, strokeWidth = 6, label }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const tone = scoreTone(safeScore);
  const color = TONE_COLORS[tone] || '#6366F1';
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeScore / 100) * circumference;
  const isOptimal = tone === 'improve' && safeScore >= 80;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative rounded-full flex items-center justify-center ${
          isOptimal ? 'shadow-glow-emerald' : ''
        }`}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-dark-200 dark:stroke-dark-800"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center font-display font-black text-dark-900 dark:text-white">
          <span className="text-xl leading-none">{Math.round(safeScore)}</span>
          <span className="text-[10px] font-mono text-dark-400 font-normal leading-none mt-0.5">%</span>
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-dark-500 dark:text-dark-400">
          {label}
        </span>
      )}
    </div>
  );
}
