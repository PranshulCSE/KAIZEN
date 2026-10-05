import { useParams, Link, useNavigate } from 'react-router';
import {
  Briefcase,
  Building2,
  Calendar,
  Sparkles,
  ArrowLeft,
  Zap,
  CheckCircle2,
  Layers,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useJobAnalysis } from '../hooks/useJobAnalyses.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';
import { ROUTES } from '../constants/routes.js';

export default function JobAnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { analysis, isLoading, error } = useJobAnalysis(id);

  if (isLoading) return <PageLoader label="Loading job breakdown" />;
  if (error || !analysis) {
    return (
      <EmptyState
        title="Analysis not found"
        description={error || 'This job analysis may have been deleted.'}
        action={
          <Button as={Link} to={ROUTES.JOB_ANALYSES} size="sm">
            Back to Job Analyses
          </Button>
        }
      />
    );
  }

  const a = analysis.analysis || {};

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 shadow-sm">
        <div className="space-y-2">
          <Link
            to={ROUTES.JOB_ANALYSES}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all job targets</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-dark-900 dark:text-white">
            {analysis.jobTitle || 'Untitled Role'}
          </h1>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>{analysis.company || 'Company not specified'}</span>
            <span>·</span>
            <Calendar className="w-3.5 h-3.5" />
            <span>Analyzed {formatDate(analysis.createdAt)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="lime"
            size="md"
            className="font-bold shadow-md"
            onClick={() =>
              navigate(
                `${ROUTES.OPTIMIZE}?jobAnalysisId=${analysis._id}${
                  analysis.resumeId?._id ? `&resumeId=${analysis.resumeId._id}` : ''
                }`
              )
            }
          >
            <Zap className="w-4 h-4 text-ink fill-current" />
            <span>Optimize a Resume for This</span>
          </Button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SkillCard
          title="Required Technical Skills"
          items={a.requiredSkills}
          tone="improve"
          badgeClass="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
        />
        <SkillCard
          title="Preferred Qualifications"
          items={a.preferredSkills}
          tone="revise"
          badgeClass="bg-accent-50 dark:bg-accent-950/60 text-accent-950 dark:text-accent-300 border-accent-200 dark:border-accent-800"
        />
        <SkillCard
          title="High-Priority ATS Keywords"
          items={a.keywords}
          tone="primary"
          badgeClass="bg-primary-50 dark:bg-primary-950/60 text-primary-900 dark:text-primary-300 border-primary-200 dark:border-primary-800 font-mono"
        />
        <SkillCard
          title="Soft Skills & Working Style"
          items={a.softSkills}
          tone="neutral"
          badgeClass="bg-dark-50 dark:bg-dark-800 text-dark-800 dark:text-dark-200 border-dark-200 dark:border-dark-700"
        />
      </div>

      {/* Experience & Education Parameters */}
      <Card className="p-6 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 border border-primary-100 dark:border-primary-900">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-dark-400">Experience Level</p>
              <p className="mt-1 text-sm font-semibold text-dark-900 dark:text-white">
                {a.experienceLevel || 'Not explicitly specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 flex items-center justify-center shrink-0 border border-accent-100 dark:border-accent-900">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-dark-400">Education Requirements</p>
              <p className="mt-1 text-sm font-semibold text-dark-900 dark:text-white">
                {a.educationRequirements || 'Not explicitly specified'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Core Responsibilities */}
      {a.roleResponsibilities?.length > 0 && (
        <Card className="p-6 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 space-y-4">
          <h2 className="font-display text-base font-bold text-dark-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span>Core Role Responsibilities</span>
          </h2>
          <ul className="space-y-2.5">
            {a.roleResponsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-dark-700 dark:text-dark-300 leading-relaxed">
                <span className="text-primary-600 dark:text-primary-400 font-bold mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ATS Tips */}
      {a.atsTips?.length > 0 && (
        <Card className="p-6 border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-4">
          <h2 className="font-display text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>ATS Strategy Tips for This Target</span>
          </h2>
          <ul className="space-y-2.5">
            {a.atsTips.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-300 leading-relaxed">
                <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">✦</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function SkillCard({ title, items = [], badgeClass }) {
  if (!items || items.length === 0) return null;
  return (
    <Card className="p-5 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 space-y-3">
      <h3 className="font-display font-bold text-sm text-dark-900 dark:text-white">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${badgeClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}
