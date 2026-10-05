import { Link } from 'react-router';
import { Users, TrendingUp, FileText, AlertCircle, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useAdminDashboard, useAdminUsers } from '../hooks/useAdmin.js';
import { ROUTES } from '../constants/routes.js';

export default function AdminDashboard() {
  const { stats, isLoading: isStatsLoading, error: statsError } = useAdminDashboard();
  const { users, isLoading: areUsersLoading, error: usersError } = useAdminUsers();

  if (isStatsLoading || areUsersLoading) return <PageLoader label="Loading administration dashboard" />;

  const metrics = [
    {
      icon: Users,
      label: 'Total Registered Users',
      value: valueOf(stats, ['totalUsers', 'usersCount']),
      fallback: users.length,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-950/60'
    },
    {
      icon: FileText,
      label: 'Resumes Stored',
      value: valueOf(stats, ['totalResumes', 'resumesCount']),
      fallback: '-',
      color: 'text-accent-600 dark:text-accent-400',
      bg: 'bg-accent-50 dark:bg-accent-950/60'
    },
    {
      icon: TrendingUp,
      label: 'Average ATS Score',
      value: valueOf(stats, ['averageScore', 'avgScore']),
      fallback: '—',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      icon: AlertCircle,
      label: 'System Exceptions',
      value: valueOf(stats, ['activeErrors', 'errors']),
      fallback: '0',
      color: 'text-danger-600 dark:text-danger-400',
      bg: 'bg-danger-50 dark:bg-danger-950/60'
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-900 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Operations & Controls</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-dark-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            Platform performance metrics, user directory controls, and real-time audit log streaming.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button as={Link} to={ROUTES.ADMIN_USERS} variant="secondary" size="sm" className="text-xs">
            <Users className="h-3.5 w-3.5" />
            <span>Manage Users</span>
          </Button>
          <Button as={Link} to={ROUTES.ADMIN_LOGS} variant="primary" size="sm" className="text-xs font-bold">
            <Activity className="h-3.5 w-3.5" />
            <span>Audit Logs</span>
          </Button>
        </div>
      </div>

      {(statsError || usersError) && (
        <div className="rounded-xl border border-danger-200 dark:border-danger-900 bg-danger-50 dark:bg-danger-950/40 p-4 text-xs font-medium text-danger-700 dark:text-danger-300">
          {statsError || usersError}
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(({ icon: Icon, label, value, fallback, color, bg }) => (
          <Card key={label} className="p-6 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-dark-400">{label}</p>
                <p className="mt-2 font-display text-3xl font-black text-dark-900 dark:text-white">
                  {value ?? fallback}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${bg} ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Users Card */}
      <Card className="overflow-hidden border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-dark-100 dark:border-dark-800 px-6 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-dark-900 dark:text-white">Recent Accounts</h2>
            <p className="text-xs text-dark-400 mt-0.5">Recently registered candidate and recruiter profiles.</p>
          </div>
          <Button as={Link} to={ROUTES.ADMIN_USERS} variant="ghost" size="sm" className="text-xs">
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        {users.length ? (
          <div className="divide-y divide-dark-100 dark:divide-dark-800">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 hover:bg-dark-50/50 dark:hover:bg-dark-800/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-dark-900 dark:text-white">{user.name || 'Unnamed Candidate'}</p>
                  <p className="text-xs text-dark-400 font-mono mt-0.5">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      user.isVerified
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                  <span className="text-xs font-mono uppercase text-dark-400 px-2 py-0.5 rounded bg-dark-50 dark:bg-dark-800 border border-dark-100 dark:border-dark-700">
                    {user.role || 'user'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-6 py-8 text-xs text-center text-dark-400">No users found in database.</p>
        )}
      </Card>
    </div>
  );
}

function valueOf(stats, keys) {
  if (!stats) return null;
  for (const key of keys) {
    if (stats[key] !== undefined && stats[key] !== null) return stats[key];
  }
  return null;
}
