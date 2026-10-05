import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar, Building2, ChevronRight, ArrowRight } from 'lucide-react';
import { useJobAnalyses } from '../hooks/useJobAnalyses.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { formatDate } from '../utils/formatters.js';
import { ROUTES, jobAnalysisDetailPath } from '../constants/routes.js';
import { apiErrorMessage } from '../api/axiosClient.js';

export default function JobAnalyses() {
  const { analyses, isLoading, removeAnalysis } = useJobAnalyses();

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-900 text-xs font-semibold text-primary-700 dark:text-primary-300 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target Role Intelligence</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-dark-900 dark:text-white">
            Job Descriptions & Rubrics
          </h1>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            Deconstruct target job postings to extract required keywords, ATS weightings, and responsibilities.
          </p>
        </div>
        <Button as={Link} to={ROUTES.ANALYZE_JOB} variant="lime" className="font-bold shadow-md">
          <Plus className="w-4 h-4 text-ink" />
          <span>Analyze a New Job</span>
        </Button>
      </div>

      {isLoading ? (
        <PageLoader label="Loading job analyses" />
      ) : analyses.length === 0 ? (
        <EmptyState
          title="No jobs analyzed yet"
          description="Paste a job description or provide a job URL, and Kaizen will extract the required skills, ATS keywords, and scoring weights."
          action={
            <Button as={Link} to={ROUTES.ANALYZE_JOB} size="md" variant="primary">
              <Plus className="w-4 h-4" />
              <span>Analyze your first job</span>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analyses.map((a) => (
            <AnalysisCard key={a._id} analysis={a} onDelete={removeAnalysis} />
          ))}
        </div>
      )}
    </div>
  );
}

function AnalysisCard({ analysis, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this job analysis?')) return;
    setIsDeleting(true);
    try {
      await onDelete(analysis._id);
      toast.success('Job analysis removed.');
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Could not delete.'));
      setIsDeleting(false);
    }
  };

  const reqSkillsCount = analysis.analysis?.requiredSkills?.length || 0;
  const keywordsCount = analysis.analysis?.keywords?.length || 0;

  return (
    <Card className="p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-200 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-100 dark:border-primary-900">
            <Building2 className="w-5 h-5" />
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-dark-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 transition-colors"
            title="Delete analysis"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <Link to={jobAnalysisDetailPath(analysis._id)} className="block">
          <h3 className="font-display font-bold text-base text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
            {analysis.jobTitle || 'Untitled Role'}
          </h3>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5 line-clamp-1">
            {analysis.company || 'Company not specified'}
          </p>
        </Link>

        {/* Skill counts summary */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-dark-100 dark:border-dark-800 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-medium">
            {reqSkillsCount} Required Skills
          </span>
          <span className="px-2 py-0.5 rounded-md bg-accent-50 dark:bg-accent-950/50 text-accent-900 dark:text-accent-300 font-medium">
            {keywordsCount} ATS Keywords
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-3 border-t border-dark-100 dark:border-dark-800 text-xs text-dark-400">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(analysis.createdAt)}</span>
        </span>
        <Link
          to={jobAnalysisDetailPath(analysis._id)}
          className="flex items-center gap-1 font-bold text-primary-600 dark:text-primary-400 hover:underline"
        >
          <span>View Rubric</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
