import { useParams, Link, useNavigate } from 'react-router-dom';
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

  if (isLoading) return <PageLoader label="Loading analysis" />;
  if (error || !analysis) {
    return <EmptyState title="Analysis not found" description={error || 'This analysis may have been deleted.'} />;
  }

  const a = analysis.analysis || {};

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Job analysis</span>
          <h1 className="mt-2 font-display text-3xl text-ink">{analysis.jobTitle || 'Untitled role'}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {analysis.company || 'No company listed'} · Analyzed {formatDate(analysis.createdAt)}
          </p>
        </div>
        <Button
          onClick={() =>
            navigate(`${ROUTES.OPTIMIZE}?jobAnalysisId=${analysis._id}${analysis.resumeId?._id ? `&resumeId=${analysis.resumeId._id}` : ''
              }`)
          }
        >
          Optimize a resume for this
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SkillCard title="Required skills" items={a.requiredSkills} tone="improve" />
        <SkillCard title="Preferred skills" items={a.preferredSkills} tone="revise" />
        <SkillCard title="Soft skills" items={a.softSkills} tone="neutral" />
        <SkillCard title="Keywords to include" items={a.keywords} tone="neutral" />
      </div>

      <Card className="p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow">Experience level</p>
            <p className="mt-1 text-sm text-ink">{a.experienceLevel || 'Not specified'}</p>
          </div>
          <div>
            <p className="eyebrow">Education</p>
            <p className="mt-1 text-sm text-ink">{a.educationRequirements || 'Not specified'}</p>
          </div>
        </div>
      </Card>

      {a.roleResponsibilities?.length > 0 && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">Core responsibilities</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
            {a.roleResponsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Card>
      )}

      {a.atsTips?.length > 0 && (
        <Card className="p-6">
          <h2 className="font-display text-lg text-ink">ATS tips for this role</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
            {a.atsTips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      )}

      <Link to={ROUTES.JOB_ANALYSES} className="text-sm text-ink-muted underline-offset-2 hover:text-ink hover:underline">
        ← Back to job analyses
      </Link>
    </div>
  );
}

function SkillCard({ title, items = [], tone }) {
  if (!items || items.length === 0) return null;
  return (
    <Card className="p-5">
      <h3 className="font-display text-base text-ink">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} tone={tone}>
            {item}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
