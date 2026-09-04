import { useRef, useState } from 'react';
import { Download, Eye, Trash2, Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { resumeDetailPath } from '../constants/routes.js';
import { formatDate } from '../utils/formatters.js';

export default function Resumes() {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { resumes, isLoading, error, uploadResume, removeResume } = useResumes();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Please choose a file smaller than 5MB.');
            return;
        }
        setIsUploading(true);
        try {
            await uploadResume(file, file.name.replace(/\.[^.]+$/, ''));
            toast.success('Resume uploaded.');
        } catch {
            toast.error('Could not upload this resume.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resume?')) return;
        try {
            await removeResume(id);
            toast.success('Resume deleted.');
        } catch {
            toast.error('Could not delete this resume.');
        }
    };

    if (isLoading) return <PageLoader label="Loading resumes" />;

    return (
        <div className="flex flex-col gap-8">
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <span className="eyebrow">Your library</span>
                    <h1 className="mt-2 font-display text-3xl text-ink">My resumes</h1>
                    <p className="mt-1 text-sm text-ink-muted">Keep your working versions in one place.</p>
                </div>
                <Button onClick={() => inputRef.current?.click()} isLoading={isUploading}>
                    <Plus className="h-4 w-4" /> Upload resume
                </Button>
            </div>

            {error && <p className="rounded border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700">{error}</p>}
            {!error && resumes.length === 0 ? (
                <EmptyState title="No resumes yet" description="Upload a PDF or DOCX to start improving your applications." action={<Button onClick={() => inputRef.current?.click()}>Upload your first resume</Button>} />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume) => {
                        const score = resume.optimization?.atsScore || 0;
                        return (
                            <Card key={resume._id} className="flex flex-col gap-5 p-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded bg-primary-50 p-2 text-primary-600"><FileText className="h-5 w-5" /></div>
                                    <div className="min-w-0 flex-1"><h2 className="truncate text-base font-semibold text-ink">{resume.title}</h2><p className="text-xs text-ink-muted">Updated {formatDate(resume.updatedAt)}</p></div>
                                </div>
                                <div><div className="mb-2 flex justify-between text-sm"><span className="text-ink-muted">ATS score</span><strong className="text-ink">{score}/100</strong></div><div className="h-2 overflow-hidden rounded-full bg-dark-100"><div className="h-full bg-gradient-primary" style={{ width: `${Math.max(0, Math.min(100, score))}%` }} /></div></div>
                                <div className="mt-auto flex gap-2">
                                    <Button as="a" href={resume.fileUrl || '#'} variant="secondary" size="sm" className="flex-1" onClick={(event) => { if (!resume.fileUrl) event.preventDefault(); }}><Download className="h-4 w-4" /> Download</Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(resumeDetailPath(resume._id))}
                                        aria-label={`View ${resume.title}`}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(resume._id)}
                                        aria-label={`Delete ${resume.title}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
