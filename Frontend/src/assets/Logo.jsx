import { Link } from 'react-router';
import { ROUTES } from '../constants/routes.js';

export default function Logo({ className = '', iconOnly = false, showBadge = false }) {
    return (
        <Link to={ROUTES.DASHBOARD} className={`inline-flex items-center gap-3 group select-none ${className}`}>
            
            <img src="Logo_Black.png" className={'w-26 h-14'} />
            {!iconOnly && (
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                        <span className="font-display font-black text-2xl tracking-tight text-dark-900 group-hover:text-primary-600 transition-colors">
                            Kaizen
                        </span>
                        {showBadge && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700">
                                AI
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-dark-400 -mt-1 font-mono">
                        RESUME OPTIMIZER
                    </span>
                </div>
            )}
        </Link>
    );
}
