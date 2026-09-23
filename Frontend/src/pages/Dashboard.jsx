import { BarChart3, UploadCloud, TrendingUp, Clock, ShieldCheck, Sparkles, ArrowRight, FileText, CheckCircle2, Download, Mail, Github, Zap, Bot, LayoutTemplate } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useResumes } from '../hooks/useResumes.js';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { ROUTES, resumeDetailPath } from '../constants/routes.js';
import { formatDate } from '../utils/formatters.js';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { resumes, isLoading, downloadResume } = useResumes();
    const [downloadingId, setDownloadingId] = useState(null);

    const averageScore = resumes.length
        ? Math.round(resumes.reduce((total, resume) => total + (resume.optimization?.atsScore || 0), 0) / resumes.length)
        : 0;

    const handleQuickDownload = async (resume, e) => {
        e.preventDefault();
        e.stopPropagation();
        setDownloadingId(resume._id);
        try {
            await downloadResume(resume._id, resume.title, resume.optimization);
            toast.success('Resume downloaded!');
        } catch (err) {
            toast.error(err.message || 'Download failed');
        } finally {
            setDownloadingId(null);
        }
    };

    if (isLoading) return <PageLoader label="Loading dashboard" />;

    return (
        <div className="flex flex-col gap-8 pb-12 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 via-primary-800 to-indigo-900 p-8 text-white shadow-xl shadow-primary-950/10">
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-primary-200 mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                            <span>AI Resume Engine v2.0</span>
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
                            Welcome back, {user?.name || user?.email?.split('@')[0] || 'Super Admin'}!
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-primary-200/90 leading-relaxed">
                            Analyze, rewrite, and tune your resumes to score 90+ on automated Applicant Tracking Systems.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            as={Link}
                            to={ROUTES.BUILDER}
                            variant="lime"
                            className="shadow-lg shadow-lime/20 font-bold px-5"
                        >
                            <LayoutTemplate className="w-4 h-4 text-ink" />
                            <span>Visual Builder</span>
                        </Button>
                        <Button
                            as={Link}
                            to={ROUTES.OPTIMIZE}
                            variant="secondary"
                            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>AI Optimizer</span>
                        </Button>
                    </div>
                </div>

                {/* Ambient glow shapes */}
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Metric Highlights */}
            <div className="grid gap-5 md:grid-cols-3">
                <div className="group rounded-2xl bg-white p-6 border border-dark-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-dark-400">Total Resumes</p>
                            <h3 className="text-3xl font-black text-dark-900 mt-2 font-display">{resumes.length}</h3>
                            <p className="text-xs text-dark-500 mt-1">Stored in your library</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="group rounded-2xl bg-white p-6 border border-dark-100 shadow-sm hover:shadow-md hover:border-accent-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-dark-400">Average ATS Score</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <h3 className="text-3xl font-black text-dark-900 font-display">{averageScore}</h3>
                                <span className="text-xs font-mono text-dark-400">/100</span>
                            </div>
                            <p className="text-xs text-emerald-600 font-medium mt-1">
                                {averageScore >= 75 ? 'Optimal benchmark' : 'Room for improvement'}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="group rounded-2xl bg-white p-6 border border-dark-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-dark-400">Target Readiness</p>
                            <h3 className="text-3xl font-black text-dark-900 mt-2 font-display">
                                {resumes.filter((r) => (r.optimization?.atsScore || 0) >= 75).length}
                            </h3>
                            <p className="text-xs text-dark-500 mt-1">Resumes scoring 75+ ready to apply</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Career Toolkit Section - 4 Feature Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Link
                    to={ROUTES.BUILDER}
                    className="group rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-white border border-indigo-100 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 group-hover:scale-105 transition-transform">
                                <LayoutTemplate className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white font-mono">
                                4 TEMPLATES
                            </span>
                        </div>
                        <h3 className="text-sm font-bold font-display text-dark-900 mt-3 group-hover:text-primary-600 transition-colors">
                            Visual Resume Builder
                        </h3>
                        <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                            Live WYSIWYG editor with Harvard, Modern & Minimalist templates + AI bullet copilot.
                        </p>
                    </div>
                    <div className="pt-3 flex items-center text-xs font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
                        <span>Open Builder &rarr;</span>
                    </div>
                </Link>

                <Link
                    to={ROUTES.MOCK_INTERVIEW}
                    className="group rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-white border border-emerald-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                                <Bot className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">
                                REAL-TIME
                            </span>
                        </div>
                        <h3 className="text-sm font-bold font-display text-dark-900 mt-3 group-hover:text-emerald-700 transition-colors">
                            AI Mock Interview
                        </h3>
                        <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                            Live voice/speech interactive simulator with instant STAR scoring & ideal answer coaching.
                        </p>
                    </div>
                    <div className="pt-3 flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                        <span>Start Session &rarr;</span>
                    </div>
                </Link>

                <Link
                    to={ROUTES.COVER_LETTER}
                    className="group rounded-2xl bg-gradient-to-br from-primary-50/70 via-white to-white border border-primary-100 p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition-all flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-primary-100 text-primary-700 group-hover:scale-105 transition-transform">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-600 text-white font-mono">
                                COLD OUTREACH
                            </span>
                        </div>
                        <h3 className="text-sm font-bold font-display text-dark-900 mt-3 group-hover:text-primary-600 transition-colors">
                            Cover Letter & LinkedIn Notes
                        </h3>
                        <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                            Bespoke cover letters and under-300-char LinkedIn networking messages.
                        </p>
                    </div>
                    <div className="pt-3 flex items-center text-xs font-bold text-primary-600 group-hover:translate-x-1 transition-transform">
                        <span>Generate &rarr;</span>
                    </div>
                </Link>

                <Link
                    to={ROUTES.GITHUB_IMPORT}
                    className="group rounded-2xl bg-gradient-to-br from-dark-50/70 via-white to-white border border-dark-100 p-5 shadow-sm hover:shadow-md hover:border-dark-300 transition-all flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-start justify-between">
                            <div className="p-2.5 rounded-xl bg-dark-100 text-dark-900 group-hover:scale-105 transition-transform">
                                <Github className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-dark-900 text-white font-mono">
                                PORTFOLIO
                            </span>
                        </div>
                        <h3 className="text-sm font-display font-bold text-dark-900 mt-3 group-hover:text-primary-600 transition-colors">
                            GitHub Portfolio Importer
                        </h3>
                        <p className="text-[11px] text-dark-500 mt-1 leading-relaxed">
                            Auto-sync public GitHub repos into quantified, ATS-compliant project bullets.
                        </p>
                    </div>
                    <div className="pt-3 flex items-center text-xs font-bold text-dark-700 group-hover:translate-x-1 transition-transform">
                        <span>Import Repos &rarr;</span>
                    </div>
                </Link>
            </div>

            {/* Recent Resumes Table / Grid */}
            <div className="rounded-2xl bg-white border border-dark-100/90 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 border-b border-dark-100 mb-4">
                    <div>
                        <h2 className="text-xl font-bold font-display text-dark-900">Recent Resumes</h2>
                        <p className="text-xs text-dark-500 mt-0.5">Quickly preview, optimize, or export your documents</p>
                    </div>
                    <Link
                        to={ROUTES.RESUMES}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
                    >
                        <span>View all ({resumes.length})</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                {resumes.length === 0 ? (
                    <div className="py-12 text-center">
                        <FileText className="w-10 h-10 text-dark-300 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-dark-800">No resumes yet</p>
                        <p className="text-xs text-dark-500 mt-1">Upload a PDF or DOCX file to see it here.</p>
                        <Button as={Link} to={ROUTES.RESUMES} variant="primary" size="sm" className="mt-4">
                            Upload resume
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-dark-100">
                        {resumes.slice(0, 5).map((resume) => {
                            const score = resume.optimization?.atsScore || 0;
                            const isGood = score >= 75;
                            return (
                                <div
                                    key={resume._id}
                                    onClick={() => navigate(resumeDetailPath(resume._id))}
                                    className="py-4 flex flex-wrap items-center justify-between gap-4 group hover:bg-dark-50/70 px-3 rounded-xl transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3.5 min-w-[240px]">
                                        <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600 group-hover:scale-105 transition-transform">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-dark-900 group-hover:text-primary-600 transition-colors">
                                                {resume.title}
                                            </h3>
                                            <p className="text-xs text-dark-400 font-mono">
                                                Updated {formatDate(resume.updatedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ATS Score pill */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 hidden sm:block">
                                            <div className="flex justify-between text-[11px] mb-1 font-mono">
                                                <span className="text-dark-400">Score</span>
                                                <span className={`font-bold ${isGood ? 'text-emerald-600' : 'text-dark-700'}`}>
                                                    {score}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-dark-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        isGood
                                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                                            : 'bg-gradient-to-r from-primary-500 to-accent-400'
                                                    }`}
                                                    style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={(e) => handleQuickDownload(resume, e)}
                                                isLoading={downloadingId === resume._id}
                                                variant="secondary"
                                                size="sm"
                                                className="text-xs"
                                                title="Download PDF directly"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span className="hidden md:inline">Download</span>
                                            </Button>

                                            <Button
                                                as={Link}
                                                to={resumeDetailPath(resume._id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span>Preview</span>
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
