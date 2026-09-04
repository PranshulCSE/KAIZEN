import { BarChart3, Upload, TrendingUp, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useResumes } from '../hooks/useResumes.js';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { ROUTES, resumeDetailPath } from '../constants/routes.js';
import { formatDate } from '../utils/formatters.js';

export default function Dashboard() {
    const { user } = useAuth();
    const { resumes, isLoading } = useResumes();
    const averageScore = resumes.length
        ? Math.round(resumes.reduce((total, resume) => total + (resume.optimization?.atsScore || 0), 0) / resumes.length)
        : 0;

    if (isLoading) return <PageLoader label="Loading dashboard" />;

    return (
        <div className="flex flex-col gap-8">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4 animate-fade-in">
                <div>
                    <h1>Welcome back, {user?.name || user?.firstName || 'there'}!</h1>
                    <p className="text-dark-600 mt-1">Here's what's happening with your resumes</p>
                </div>
                <Button as={Link} to={ROUTES.RESUMES} variant="accent">
                    <Upload className="w-5 h-5" />
                    Upload New Resume
                </Button>
                {user?.role === 'admin' || user?.role === 'super-admin' ? (
                    <Button as={Link} to={ROUTES.ADMIN} variant="ghost" size="sm">
                        <ShieldCheck className="h-4 w-4" /> Admin panel
                    </Button>
                ) : null}
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { icon: BarChart3, label: 'Total Resumes', value: resumes.length, color: 'primary' },
                    { icon: TrendingUp, label: 'Average ATS score', value: `${averageScore}/100`, color: 'accent' },
                    { icon: Clock, label: 'Jobs analyzed', value: '—', color: 'success' }
                ].map((stat, i) => (
                    <Card key={i} hover className="p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-dark-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <stat.icon className="w-10 h-10 opacity-20" />
                        </div>
                    </Card>
                ))}
            </div>

            {/* RECENT RESUMES */}
            <div className="animate-fade-in">
                <h2 className="mb-6">Recent Resumes</h2>
                <div className="space-y-3">
                    {resumes.slice(0, 3).map((resume) => (
                        <Card key={resume._id} hover className="flex items-center justify-between p-4">
                            <div className="flex-1">
                                <h3 className="font-semibold">{resume.title}</h3>
                                <p className="text-dark-500 text-sm">Updated {formatDate(resume.updatedAt)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="w-20 h-2 bg-dark-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-primary"
                                            style={{ width: `${resume.optimization?.atsScore || 0}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm font-bold text-primary-600 mt-1">{resume.optimization?.atsScore || 0}</p>
                                </div>
                                <Button as={Link} to={resumeDetailPath(resume._id)} variant="ghost" size="sm">View</Button>
                            </div>
                        </Card>
                    ))}
                    {!resumes.length && <p className="text-sm text-dark-500">Upload a resume to see your latest work here.</p>}
                </div>
            </div>
        </div>
    );
}
