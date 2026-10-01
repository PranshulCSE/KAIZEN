import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Download, Sparkles, ArrowLeft, Mail, Phone, MapPin, User, FileText, CheckCircle2, AlertCircle, Briefcase, GraduationCap, Award, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useResume } from '../hooks/useResumes.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ScoreGauge from '../components/ui/ScoreGauge.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';
import { ROUTES } from '../constants/routes.js';

export default function ResumeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { resume, isLoading, error, downloadPdf } = useResume(id);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadPdf({ template: selectedTemplate });
            toast.success(`Resume downloaded (${selectedTemplate === 'modern' ? 'Modern Tech' : 'Harvard Classic'} ATS)!`);
        } catch (err) {
            toast.error(err.message || 'Could not download resume PDF.');
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) return <PageLoader label="Loading resume preview" />;
    if (error || !resume) {
        return <EmptyState title="Resume not found" description={error || 'This resume may have been deleted.'} />;
    }

    const { content = {}, optimization } = resume;
    const personal = content.personalInfo || {};
    const atsScore = optimization?.atsScore || 0;

    return (
        <div className="flex flex-col gap-8 pb-12 animate-fade-in">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-dark-100 dark:border-dark-800">
                <div className="flex items-center gap-4">
                    <Link
                        to={ROUTES.RESUMES}
                        className="p-2 rounded-xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800 shadow-sm transition-all"
                        title="Back to resumes"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-md">
                                Resume Preview
                            </span>
                            {optimization && (
                                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-emerald-500" /> Optimized
                                </span>
                            )}
                        </div>
                        <h1 className="mt-1 font-display text-2xl sm:text-3xl text-dark-900 dark:text-white font-bold tracking-tight">
                            {resume.title}
                        </h1>
                        <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
                            Last updated {formatDate(resume.updatedAt)}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-dark-100/80 dark:bg-dark-800 p-1 rounded-xl border border-dark-200/80 dark:border-dark-700 text-xs">
                        <button
                            type="button"
                            onClick={() => setSelectedTemplate('modern')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                selectedTemplate === 'modern'
                                    ? 'bg-white dark:bg-dark-900 text-primary-700 dark:text-primary-400 shadow-xs'
                                    : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                            }`}
                        >
                            Modern Tech ATS
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedTemplate('classic')}
                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                selectedTemplate === 'classic'
                                    ? 'bg-white dark:bg-dark-900 text-primary-700 dark:text-primary-400 shadow-xs'
                                    : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                            }`}
                        >
                            Harvard Classic ATS
                        </button>
                    </div>

                    <Button
                        onClick={handleDownload}
                        variant="secondary"
                        isLoading={isDownloading}
                        className="shadow-sm hover:shadow-md"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download ATS PDF</span>
                    </Button>
                    <Button
                        onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}
                        variant="primary"
                        className="shadow-md shadow-primary-500/20"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Optimize with AI</span>
                    </Button>
                </div>
            </div>

            {/* Score & Profile Header Card */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Personal Information */}
                <Card className="p-6 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-dark-50/50 dark:from-dark-900 dark:to-dark-950 border-dark-100 dark:border-dark-800">
                    <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800 mb-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Personal Details</h2>
                        </div>
                        <span className="text-xs font-mono text-dark-400 dark:text-dark-500">Parsed by Kaizen</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem icon={User} label="Full Name" value={[personal.name, personal.fullName].find(v => v && v !== 'Unknown') || user?.name || 'Candidate'} />
                        <InfoItem icon={Mail} label="Email Address" value={personal.email} isLink={personal.email ? `mailto:${personal.email}` : null} />
                        <InfoItem icon={Phone} label="Phone Number" value={personal.phone} />
                        <InfoItem icon={MapPin} label="Location" value={personal.location} />
                    </div>

                    {personal.summary && (
                        <div className="mt-5 pt-4 border-t border-dark-100 dark:border-dark-800">
                            <span className="text-xs font-semibold uppercase tracking-wider text-dark-500 dark:text-dark-400 block mb-2">Professional Summary</span>
                            <p className="text-sm leading-relaxed text-dark-700 dark:text-dark-300 bg-white/80 dark:bg-dark-950 p-4 rounded-xl border border-dark-100 dark:border-dark-800 shadow-sm">
                                {personal.summary}
                            </p>
                        </div>
                    )}
                </Card>

                {/* ATS Gauge Card */}
                <Card className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-b from-white to-primary-50/20 dark:from-dark-900 dark:to-primary-950/20 border-dark-100 dark:border-dark-800">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-200/30 dark:bg-primary-900/30 rounded-full blur-2xl pointer-events-none" />
                    <ScoreGauge score={atsScore} size={110} label="ATS Match Score" />

                    <div className="mt-4">
                        <p className="text-xs font-semibold text-dark-800 dark:text-dark-200">
                            {atsScore >= 75 ? '🌟 Excellent ATS Ready' : atsScore >= 50 ? '⚡ Good potential, needs refinement' : '⚠️ Needs optimization'}
                        </p>
                        <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-1 max-w-[200px] mx-auto">
                            {optimization?.lastOptimized
                                ? `Optimized ${formatDate(optimization.lastOptimized)}`
                                : 'Run AI optimization to boost your score to 90+'}
                        </p>
                    </div>

                    <Button
                        onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}
                        variant="ghost"
                        size="sm"
                        className="mt-4 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-950/40"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> Boost this score
                    </Button>
                </Card>
            </div>

            {/* AI Optimization Suggestions (if available) */}
            {optimization?.suggestions?.length > 0 ? (
                <Card className="p-6 border-l-4 border-l-accent-500 bg-gradient-to-r from-accent-50/30 via-white to-white dark:from-accent-950/30 dark:via-dark-900 dark:to-dark-900 border-dark-100 dark:border-dark-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                            <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">AI Recommendations</h2>
                        </div>
                        <Badge tone="accent">Actionable Advice</Badge>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {optimization.suggestions.map((s, i) => {
                            const isObj = s && typeof s === 'object';
                            const priority = isObj ? s.priority : null;
                            const category = isObj ? s.category : null;
                            const text = isObj ? (s.reason || s.suggestion || s.text) : s;
                            return (
                                <div key={i} className="p-4 rounded-xl border border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm flex flex-col justify-between gap-2 hover:border-accent-200 dark:hover:border-accent-700 transition-all">
                                    <div className="flex items-center justify-between gap-2">
                                        <Badge tone={priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low'}>
                                            {priority ? `${priority.toUpperCase()} PRIORITY` : `SUGGESTION ${i + 1}`}
                                        </Badge>
                                        {category && <span className="text-xs font-mono font-medium text-dark-500 dark:text-dark-400">{category}</span>}
                                    </div>
                                    <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">{text}</p>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            ) : null}

            {/* Skills Showcase */}
            {content.skills?.length > 0 && (
                <Card className="p-6 border-dark-100 dark:border-dark-800">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-dark-100 dark:border-dark-800 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Extracted Skills</h2>
                            <p className="text-xs text-dark-500 dark:text-dark-400">{content.skills.length} skills identified in resume</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {content.skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-dark-50 dark:bg-dark-800 text-dark-800 dark:text-dark-200 border border-dark-200/80 dark:border-dark-700 hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:text-primary-700 dark:hover:text-primary-300 hover:border-primary-200 transition-all cursor-default shadow-xs"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Experience Section */}
            {content.experience?.length > 0 && (
                <Card className="p-6 border-dark-100 dark:border-dark-800">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-dark-100 dark:border-dark-800 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Work Experience</h2>
                            <p className="text-xs text-dark-500 dark:text-dark-400">Chronological history</p>
                        </div>
                    </div>

                    <div className="divide-y divide-dark-100 dark:divide-dark-800">
                        {content.experience.map((exp, i) => (
                            <div key={i} className="py-5 first:pt-0 last:pb-0">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="text-base font-bold text-dark-900 dark:text-white">{exp.role || 'Role'}</h3>
                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{exp.company || 'Company'}</p>
                                    </div>
                                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300">
                                        {exp.startDate ? formatDate(exp.startDate) : ''} — {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                                    </span>
                                </div>
                                {exp.bulletPoints?.length > 0 && (
                                    <ul className="mt-3 space-y-2 pl-2 text-sm text-dark-700 dark:text-dark-300">
                                        {exp.bulletPoints.map((bp, j) => (
                                            <li key={j} className="flex items-start gap-2.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                                                <span className="leading-relaxed">{bp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Education Section */}
            {content.education?.length > 0 && (
                <Card className="p-6 border-dark-100 dark:border-dark-800">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-dark-100 dark:border-dark-800 mb-5">
                        <div className="w-9 h-9 rounded-lg bg-accent-50 dark:bg-accent-950/60 text-accent-600 dark:text-accent-400 flex items-center justify-center">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Education & Qualifications</h2>
                            <p className="text-xs text-dark-500 dark:text-dark-400">Academic background</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {content.education.map((edu, i) => (
                            <div key={i} className="p-4 rounded-xl border border-dark-100 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950">
                                <p className="font-bold text-dark-900 dark:text-white text-sm">{edu.degree} {edu.field && `· ${edu.field}`}</p>
                                <p className="text-xs text-primary-700 dark:text-primary-300 font-medium mt-1">{edu.institution}</p>
                                {edu.endYear && <p className="text-xs font-mono text-dark-400 dark:text-dark-500 mt-2">Graduated: {edu.endYear}</p>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

function InfoItem({ icon: Icon, label, value, isLink }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-dark-900 border border-dark-100/80 dark:border-dark-800 shadow-2xs">
            <div className="p-2 rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-500 dark:text-dark-400 shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-mono text-dark-400 dark:text-dark-500 uppercase tracking-wider">{label}</p>
                {isLink && value ? (
                    <a href={isLink} className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline truncate block">
                        {value}
                    </a>
                ) : (
                    <p className="text-sm font-semibold text-dark-800 dark:text-dark-200 truncate">{value || '—'}</p>
                )}
            </div>
        </div>
    );
}
