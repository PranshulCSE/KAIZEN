import { Link } from 'react-router';
import { ROUTES } from '../constants/routes.js';

export default function Logo({ className = '', iconOnly = false, showBadge = false }) {
    return (
        <Link to={ROUTES.DASHBOARD} className={`inline-flex items-center gap-3 group select-none ${className}`}>

            <img src="Logo_White.png" className={'w-30 h-20 mb-0 rounded-3xl'} />
           
        </Link>
    );
}
