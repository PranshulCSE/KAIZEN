import React from 'react';
import { Link } from 'react-router';
import { Sun, Moon, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Logo from '../../assets/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ROUTES } from '../../constants/routes.js';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-200/80 dark:border-dark-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <Logo to={ROUTES.HOME} showBadge />

        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-dark-200/80 dark:border-dark-700 bg-dark-50/80 dark:bg-dark-800/80 text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white transition-all shadow-2xs cursor-pointer active:scale-95"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
            ) : (
              <Moon className="w-4 h-4 text-dark-600" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Button as={Link} to={ROUTES.DASHBOARD} variant="secondary" size="sm" className="hidden sm:inline-flex">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  window.location.href = ROUTES.HOME;
                }}
                className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to={ROUTES.LOGIN} variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to={ROUTES.REGISTER} variant="primary" size="sm">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;