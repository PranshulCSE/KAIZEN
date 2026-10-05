import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Logo from '../../assets/Logo.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function AppShell({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-dark-900 dark:text-dark-50 transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-dark-950/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10 shadow-2xl animate-fade-in-right">
            <Sidebar />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-dark-400 hover:text-dark-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border-b border-dark-200/80 dark:border-dark-800 shadow-2xs sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-xl text-dark-600 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo showBadge />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
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
