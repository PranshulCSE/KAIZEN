import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';
import { ROUTES } from '../constants/routes.js';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
      <p className="font-mono text-sm text-ink-muted">404</p>
      <h1 className="font-display text-3xl text-ink">This page doesn't exist.</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        The link might be broken, or the page may have moved.
      </p>
      <Button as={Link} to={ROUTES.HOME} className="mt-2">
        Back to home
      </Button>
    </div>
  );
}
