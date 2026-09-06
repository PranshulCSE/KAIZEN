import { Link } from 'react-router';
import { ROUTES } from '../constants/routes.js';

export default function Logo({ className = '', iconOnly = false, showBadge = false }) {
    return (
        <Link to={ROUTES.DASHBOARD} className={`inline-flex items-center gap-3 group select-none ${className}`}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 shadow-md shadow-primary-500/25 group-hover:scale-105 group-hover:shadow-primary-500/40 transition-all duration-300">
                {/* Stylized Modern Japanese / Geometric K Crest */}
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" strokeWidth="2.2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v16" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12l10-8" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 15.5l9 5.5" />
                    <circle cx="17.5" cy="5.5" r="2.5" fill="currentColor" stroke="none" />
                </svg>
                {/* Glow ring */}
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-400 opacity-0 group-hover:opacity-30 blur transition duration-300" />
            </div>

            {!iconOnly && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-xl tracking-tight text-dark-900 group-hover:text-primary-600 transition-colors">
                            Kaizen
                        </span>
                        {showBadge && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700">
                                AI
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-dark-400 -mt-1 font-mono">
                        RESUME AI
                    </span>
                </div>
            )}
        </Link>
    );
}
