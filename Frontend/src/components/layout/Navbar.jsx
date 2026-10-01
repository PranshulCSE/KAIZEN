import { Link } from 'react-router';
import { Sun, Moon } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import Logo from '../assets/Logo.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { ROUTES } from '../constants/routes.js';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="border-b-2 border-line bg-paper text-ink transition-colors">
      <div className="max-w-7xl mx-auto px-lg py-md flex items-center justify-between">
        <Link to={ROUTES.HOME} className="flex-shrink-0">
          <Logo />
        </Link>

        <div className="flex items-center gap-md sm:gap-lg">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-line bg-surface text-ink hover:bg-lime/20 transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dark-700" />}
          </button>

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