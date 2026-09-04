import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { useState } from 'react';
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
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <span className="eyebrow">Job analyses</span>
                    <h1 className="mt-2 font-display text-3xl text-ink">Roles you're targeting</h1>
                </div>
                <Button as={Link} to={ROUTES.ANALYZE_JOB}>
                    Analyze a job
                </Button>
            </div>

            {isLoading ? (
                <PageLoader label="Loading job analyses" />
            ) : analyses.length === 0 ? (
                <EmptyState
                    title="No jobs analyzed yet"
                    description="Paste a job description and Kaizen will break down what it's really asking for."
                    action={
                        <Button as={Link} to={ROUTES.ANALYZE_JOB} size="sm">
                            Analyze your first job
                        </Button>
                    }
                />
            ) : (
                <div className="flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
                    {analyses.map((a) => (
                        <AnalysisRow key={a._id} analysis={a} onDelete={removeAnalysis} />
                    ))}
                </div>
            )}
        </div>
    );
}

function AnalysisRow({ analysis, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Delete this job analysis?')) return;
        setIsDeleting(true);
        try {
            await onDelete(analysis._id);
            toast.success('Deleted.');
        } catch (err) {
            toast.error(apiErrorMessage(err, 'Could not delete.'));
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-4 p-5">
            <Link to={jobAnalysisDetailPath(analysis._id)} className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{analysis.jobTitle || 'Untitled role'}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                    {analysis.company || 'No company listed'} · {formatDate(analysis.createdAt)}
                </p>
            </Link>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-ink-muted hover:text-danger disabled:opacity-50"
            >
                {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
        </div>
    );
}
