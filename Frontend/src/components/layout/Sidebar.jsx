import { Link, useLocation } from 'react-router';
import { LogOut, LayoutDashboard, FileText, Sparkles, ShieldCheck, Briefcase, ChevronRight } from 'lucide-react';
import Logo from '../../assets/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

export default function Sidebar() {
  const { logout, isAdmin, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: ROUTES.RESUMES, label: 'My Resumes', icon: FileText },
    { to: ROUTES.OPTIMIZE, label: 'AI Optimizer', icon: Sparkles, badge: 'AI' },
    { to: ROUTES.JOB_ANALYSES, label: 'Job Targets', icon: Briefcase },
  ];

  const isCurrentActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <aside className="w-64 bg-white/95 backdrop-blur-md border-r border-dark-100/80 h-screen sticky top-0 flex flex-col justify-between shadow-[2px_0_12px_-4px_rgba(0,0,0,0.03)] z-30">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-dark-100/70 bg-gradient-to-r from-primary-50/40 to-transparent">
          <Logo showBadge />
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 pt-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-dark-400">
            Workspace
          </div>

          {navItems.map((item) => {
            const active = isCurrentActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 font-semibold translate-x-1'
                    : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      active ? 'text-white' : 'text-dark-400 group-hover:text-primary-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-accent-100 text-accent-700'
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
              <div className="px-3 pb-1 pt-4 text-[11px] font-mono font-semibold uppercase tracking-wider text-dark-400">
                Administration
              </div>
              <Link
                to={ROUTES.ADMIN}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith(ROUTES.ADMIN)
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 font-semibold translate-x-1'
                    : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
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
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith(ROUTES.ADMIN_LOGS)
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/20 font-semibold translate-x-1'
                    : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900 hover:translate-x-0.5'
                }`}
              >
                <div className="flex items-center gap-3">
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
      <div className="p-4 border-t border-dark-100/70 bg-dark-50/40">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {(user?.name || user?.email || 'U')[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-dark-900 truncate">{user?.name || 'My Account'}</p>
              <p className="text-[11px] text-dark-400 truncate font-mono">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-danger-600 hover:bg-danger-50 transition-all border border-transparent hover:border-danger-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
