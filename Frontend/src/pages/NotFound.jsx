import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';
import Logo from '../assets/Logo.jsx';
import { ROUTES } from '../constants/routes.js';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F6F7F2] dark:bg-[#0B0D10] text-dark-900 dark:text-dark-100 px-6 text-center animate-fade-in transition-colors duration-200">
      <Logo showBadge />
      <div className="mt-4">
        <p className="font-mono text-sm font-bold text-primary-600 dark:text-primary-400">404 ERROR</p>
        <h1 className="font-display text-3xl font-black text-dark-900 dark:text-white mt-1">Page Not Found</h1>
        <p className="max-w-sm text-sm text-dark-500 dark:text-dark-400 mt-2">
          The link might be broken, or the page may have been relocated.
        </p>
      </div>
      <Button as={Link} to={ROUTES.HOME} variant="primary" className="mt-2 shadow-md shadow-primary-500/20">
        Back to Home
      </Button>
    </div>
  );
}
