import { Link } from 'react-router';
import { Users, TrendingUp, FileText, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Badge from '../components/ui/Badge.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useAdminDashboard, useAdminUsers } from '../hooks/useAdmin.js';
import { ROUTES } from '../constants/routes.js';

export default function AdminDashboard() {
    const { stats, isLoading: isStatsLoading, error: statsError } = useAdminDashboard();
    const { users, isLoading: areUsersLoading, error: usersError } = useAdminUsers();

    if (isStatsLoading || areUsersLoading) return <PageLoader label="Loading admin dashboard" />;

    const metrics = [
        { icon: Users, label: 'Total users', value: valueOf(stats, ['totalUsers', 'usersCount']), fallback: users.length, tone: 'primary' },
        { icon: FileText, label: 'Total resumes', value: valueOf(stats, ['totalResumes', 'resumesCount']), fallback: '-', tone: 'accent' },
        { icon: TrendingUp, label: 'Average ATS score', value: valueOf(stats, ['averageScore', 'avgScore']), fallback: '—', tone: 'success' },
        { icon: AlertCircle, label: 'System errors', value: valueOf(stats, ['activeErrors', 'errors']), fallback: '—', tone: 'danger' }
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <span className="eyebrow">Operations</span>
                    <h1 className="mt-2 font-display text-3xl text-ink">Admin dashboard</h1>
                    <p className="mt-1 text-sm text-ink-muted">Monitor the platform and manage access.</p>
                </div>
                <Button as={Link} to={ROUTES.ADMIN_USERS} variant="secondary">
                    <ShieldCheck className="h-4 w-4" /> Manage users
                </Button>
            </div>

            {(statsError || usersError) && (
                <div className="rounded border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">
                    {statsError || usersError}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map(({ icon: Icon, label, value, fallback, tone }) => (
                    <Card key={label} className="p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div><p className="text-sm text-ink-muted">{label}</p><p className="mt-2 text-3xl font-semibold text-ink">{value ?? fallback}</p></div>
                            <Icon className={`h-5 w-5 ${toneClasses[tone]}`} />
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <div><h2 className="font-display text-lg text-ink">Recent users</h2><p className="text-sm text-ink-muted">Latest accounts returned by the admin API.</p></div>
                    <Button as={Link} to={ROUTES.ADMIN_USERS} variant="ghost" size="sm">View all <ArrowRight className="h-4 w-4" /></Button>
                </div>
                {users.length ? (
                    <div className="divide-y divide-line">
                        {users.slice(0, 5).map((user) => (
                            <div key={user._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                                <div><p className="font-medium text-ink">{user.name || 'Unnamed user'}</p><p className="text-sm text-ink-muted">{user.email}</p></div>
                                <div className="flex items-center gap-3"><Badge variant={user.isVerified ? 'success' : 'neutral'}>{user.isVerified ? 'Verified' : 'Unverified'}</Badge><span className="text-xs text-ink-muted">{user.role || 'user'}</span></div>
                            </div>
                        ))}
                    </div>
                ) : <p className="px-5 py-8 text-sm text-ink-muted">No users were returned.</p>}
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

const toneClasses = {
    primary: 'text-primary-600',
    accent: 'text-accent-600',
    success: 'text-success-600',
    danger: 'text-danger-600'
};
