import React from 'react';
import { Link, useLocation } from 'react-router';
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Target,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Mail,
  Github,
  LayoutTemplate,
  Bot,
  Sun,
  Moon,
  Activity
} from 'lucide-react';
import Logo from '../../assets/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ROUTES } from '../../constants/routes.js';

export default function Sidebar() {
  const { logout, isAdmin, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: ROUTES.RESUMES, label: 'My Resumes', icon: FileText },
    { to: ROUTES.BUILDER, label: 'Visual Builder', icon: LayoutTemplate, badge: 'HOT' },
    { to: ROUTES.OPTIMIZE, label: 'ATS Optimizer', icon: Target, badge: 'ATS' },
    { to: ROUTES.MOCK_INTERVIEW, label: 'Mock Interview', icon: Bot, badge: 'LIVE' },
    { to: ROUTES.COVER_LETTER, label: 'Cover Letter & Outreach', icon: Mail },
    { to: ROUTES.JOB_ANALYSES, label: 'Job Targets', icon: Briefcase },
    { to: ROUTES.GITHUB_IMPORT, label: 'GitHub Importer', icon: Github },
  ];

  const isCurrentActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <aside className="w-64 bg-white/95 dark:bg-dark-900/95 backdrop-blur-xl border-r border-dark-200/80 dark:border-dark-800 h-screen sticky top-0 flex flex-col justify-between shadow-2xs z-30 transition-colors">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-dark-100 dark:border-dark-800 flex items-center justify-between">
          <Logo showBadge />
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white transition-all cursor-pointer active:scale-90"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dark-600" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          <div className="px-3 pb-1 pt-2 text-[10px] font-mono font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
            Workspace
          </div>

          {navItems.map((item) => {
            const active = isCurrentActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  active
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30 font-bold translate-x-0.5'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100/70 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-white' : 'text-dark-400 dark:text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-white/20 text-white'
                        : item.badge === 'HOT'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : item.badge === 'LIVE'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-accent-100 text-accent-700 dark:bg-accent-950 dark:text-accent-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <div className="px-3 pb-1 pt-3 text-[10px] font-mono font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
                Administration
              </div>
              <Link
                to={ROUTES.ADMIN}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  location.pathname === ROUTES.ADMIN
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30 font-bold translate-x-0.5'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100/70 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      location.pathname === ROUTES.ADMIN ? 'text-white' : 'text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    }`}
                  />
                  <span>Admin Panel</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
              <Link
                to={ROUTES.ADMIN_LOGS}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  location.pathname.startsWith(ROUTES.ADMIN_LOGS)
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30 font-bold translate-x-0.5'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-100/70 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity
                    className={`w-4 h-4 ${
                      location.pathname.startsWith(ROUTES.ADMIN_LOGS) ? 'text-white' : 'text-dark-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                    }`}
                  />
                  <span>System Logs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* User profile & Logout Footer */}
      <div className="p-3.5 border-t border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950/50">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
              {(user?.name || user?.email || 'U')[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-dark-900 dark:text-white truncate">{user?.name || 'My Account'}</p>
              <p className="text-[10px] text-dark-400 dark:text-dark-500 truncate font-mono">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
