import { Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Logo from '../../assets/Logo.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function AppShell({ children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-[#F6F7F2] dark:bg-[#0B0D10] text-dark-900 dark:text-dark-50 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header with Logo & Theme Toggle */}
        <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800 shadow-2xs sticky top-0 z-20 transition-colors">
          <Logo />
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dark-600" />}
          </button>
        </header>

        {/* Main Content Viewport */}
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
          <div className="mx-auto max-w-6xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
