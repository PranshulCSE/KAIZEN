import { Link, useLocation } from 'react-router';
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Sparkles,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Mail,
  Github,
  LayoutTemplate,
  Bot,
  Sun,
  Moon
} from 'lucide-react';
import Logo from '../../assets/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ROUTES } from '../../constants/routes.js';

export default function Sidebar() {
  const { logout, isAdmin, user } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: ROUTES.RESUMES, label: 'My Resumes', icon: FileText },
    { to: ROUTES.BUILDER, label: 'Visual Builder', icon: LayoutTemplate, badge: 'HOT' },
    { to: ROUTES.OPTIMIZE, label: 'AI Optimizer', icon: Sparkles, badge: 'AI' },
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
    <aside className="w-64 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-r border-dark-100/80 dark:border-dark-800 h-screen sticky top-0 flex flex-col justify-between shadow-[2px_0_12px_-4px_rgba(0,0,0,0.03)] z-30">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-dark-100/70 dark:border-dark-800 bg-gradient-to-r from-primary-50/40 to-transparent dark:from-primary-950/20 flex items-center justify-between">
          <Logo showBadge />
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-dark-600" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
          <div className="px-3 pb-1.5 pt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
            Workspace
          </div>

          {navItems.map((item) => {
            const active = isCurrentActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 font-bold translate-x-1'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-white' : 'text-dark-400 dark:text-dark-400 group-hover:text-primary-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md ${
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
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  location.pathname.startsWith(ROUTES.ADMIN)
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 font-bold translate-x-1'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      location.pathname.startsWith(ROUTES.ADMIN) ? 'text-white' : 'text-dark-400 group-hover:text-primary-600'
                    }`}
                  />
                  <span>Admin Panel</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
              <Link
                to={ROUTES.ADMIN_LOGS}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  location.pathname.startsWith(ROUTES.ADMIN_LOGS)
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 font-bold translate-x-1'
                    : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      location.pathname.startsWith(ROUTES.ADMIN_LOGS) ? 'text-white' : 'text-dark-400 group-hover:text-primary-600'
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
      <div className="p-3.5 border-t border-dark-100/70 dark:border-dark-800 bg-dark-50/40 dark:bg-dark-950/40">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0">
              {(user?.name || user?.email || 'U')[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-dark-900 dark:text-white truncate">{user?.name || 'My Account'}</p>
              <p className="text-[10px] text-dark-400 truncate font-mono">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-all border border-transparent hover:border-danger-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
