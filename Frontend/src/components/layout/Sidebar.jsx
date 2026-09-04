import { Link } from 'react-router';
import { LogOut, Home, FileText, Zap, ShieldCheck } from 'lucide-react';
import Logo from '../../assets/Logo.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { ROUTES } from '../../constants/routes.js';

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();
  const navItems = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: Home },
    { to: ROUTES.RESUMES, label: 'Resumes', icon: FileText },
    { to: ROUTES.OPTIMIZE, label: 'Optimize', icon: Zap },
  ];

  return (
    <aside className="w-64 bg-white border-r border-dark-100 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-dark-100">
        <Logo />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${isActive
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'text-dark-600 hover:bg-dark-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            to={ROUTES.ADMIN}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition-smooth ${isActive
                ? 'bg-primary-100 font-semibold text-primary-700'
                : 'text-dark-600 hover:bg-dark-50'
              }`
            }
          >
            <ShieldCheck className="w-5 h-5" />
            Admin panel
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-dark-100">
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-danger-600 hover:bg-danger-50 transition-smooth">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
