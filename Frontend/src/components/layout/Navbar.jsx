import { Link } from 'react-router';
import Button from './ui/Button.jsx';
import Logo from '../assets/Logo.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES } from '../constants/routes.js';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b-2 border-ink bg-paper">
      <div className="max-w-7xl mx-auto px-lg py-md flex items-center justify-between">
        <Link to={ROUTES.HOME} className="flex-shrink-0">
          <Logo />
        </Link>

        <div className="flex items-center gap-lg">
          {isAuthenticated ? (
            <>
              <Button as={Link} to={ROUTES.DASHBOARD} variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logout();
                  window.location.href = ROUTES.HOME;
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to={ROUTES.REGISTER} variant="lime" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;