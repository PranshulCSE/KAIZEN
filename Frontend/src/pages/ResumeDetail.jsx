import { useParams, Link, useNavigate } from 'react-router-dom';
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
    const { resume, isLoading, error } = useResume(id);

    if (isLoading) return <PageLoader label="Loading resume" />;
    if (error || !resume) {
        return <EmptyState title="Resume not found" description={error || 'This resume may have been deleted.'} />;
    }

    const { content = {}, optimization } = resume;
    const personal = content.personalInfo || {};

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <span className="eyebrow">Resume</span>
                    <h1 className="mt-2 font-display text-3xl text-ink">{resume.title}</h1>
                    <p className="mt-1 text-sm text-ink-muted">Updated {formatDate(resume.updatedAt)}</p>
                </div>
                <Button onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}>
                    Optimize this resume
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <h2 className="font-display text-lg text-ink">Personal info</h2>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <Field label="Name" value={personal.name} />
                        <Field label="Email" value={personal.email} />
                        <Field label="Phone" value={personal.phone} />
                        <Field label="Location" value={personal.location} />
                    </dl>
                    {personal.summary && (
                        <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-ink-muted">
                            {personal.summary}
                        </p>
                    )}
                </Card>

                <Card className="flex flex-col items-center justify-center gap-2 p-6">
                    <ScoreGauge score={optimization?.atsScore || 0} size={100} label="ATS score" />
                    {optimization?.lastOptimized && (
                        <p className="text-xs text-ink-muted">
                            Last optimized {formatDate(optimization.lastOptimized)}
                        </p>
                    )}
                </Card>
            </div>

            {content.skills?.length > 0 && (
                <Card className="p-6">
                    <h2 className="font-display text-lg text-ink">Skills</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {content.skills.map((skill) => (
                            <Badge key={skill} tone="neutral">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </Card>
            )}

            {content.experience?.length > 0 && (
                <Card className="p-6">
                    <h2 className="font-display text-lg text-ink">Experience</h2>
                    <div className="mt-4 flex flex-col divide-y divide-line">
                        {content.experience.map((exp, i) => (
                            <div key={i} className="py-4 first:pt-0 last:pb-0">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="text-sm font-medium text-ink">
                                        {exp.role} {exp.company && `· ${exp.company}`}
                                    </h3>
                                    <span className="text-xs text-ink-muted">
                                        {exp.startDate ? formatDate(exp.startDate) : ''} —{' '}
                                        {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                                    </span>
                                </div>
                                {exp.bulletPoints?.length > 0 && (
                                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                                        {exp.bulletPoints.map((bp, j) => (
                                            <li key={j}>{bp}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {content.education?.length > 0 && (
                <Card className="p-6">
                    <h2 className="font-display text-lg text-ink">Education</h2>
                    <div className="mt-4 flex flex-col divide-y divide-line">
                        {content.education.map((edu, i) => (
                            <div key={i} className="py-3 first:pt-0 last:pb-0 text-sm">
                                <p className="font-medium text-ink">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                                <p className="text-ink-muted">
                                    {edu.institution} {edu.endYear && `· ${edu.endYear}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {optimization?.suggestions?.length > 0 && (
                <Card className="p-6">
                    <h2 className="font-display text-lg text-ink">Suggestions from the last optimization</h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {optimization.suggestions.map((s, i) => (
                            <div key={i} className="rounded border border-line p-3">
                                <div className="flex items-center gap-2">
                                    <Badge tone={s.priority === 'high' ? 'danger' : s.priority === 'medium' ? 'revise' : 'neutral'}>
                                        {s.priority}
                                    </Badge>
                                    {s.category && <span className="text-xs text-ink-muted">{s.category}</span>}
                                </div>
                                {s.reason && <p className="mt-2 text-sm text-ink-muted">{s.reason}</p>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Link to={ROUTES.RESUMES} className="text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline">
                ← Back to resumes
            </Link>
        </div>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <dt className="text-xs text-ink-muted">{label}</dt>
            <dd className="mt-0.5 text-ink">{value || '—'}</dd>
        </div>
    );
}
