import { useRef, useState } from 'react';
import { Download, Eye, Trash2, UploadCloud, FileText, Sparkles, Plus, CheckCircle2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { resumeDetailPath, ROUTES } from '../constants/routes.js';
import { formatDate } from '../utils/formatters.js';

export default function Resumes() {
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { resumes, isLoading, error, uploadResume, removeResume, downloadResume } = useResumes();
    const [isUploading, setIsUploading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);

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
            toast.success('Resume uploaded and parsed successfully!');
        } catch {
            toast.error('Could not upload this resume.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await removeResume(id);
            toast.success('Resume deleted.');
        } catch {
            toast.error('Could not delete this resume.');
        }
    };

    const handleDownload = async (resume) => {
        setDownloadingId(resume._id);
        try {
            await downloadResume(resume._id, resume.title, resume.optimization);
            toast.success('Download started!');
        } catch (err) {
            toast.error(err.message || 'Could not download resume.');
        } finally {
            setDownloadingId(null);
        }
    };

    if (isLoading) return <PageLoader label="Loading resumes..." />;

    return (
        <div className="flex flex-col gap-8 pb-12 animate-fade-in">
            <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-dark-100">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                            Document Library
                        </span>
                        <span className="text-xs font-medium text-dark-500">
                            {resumes.length} {resumes.length === 1 ? 'version' : 'versions'} saved
                        </span>
                    </div>
                    <h1 className="mt-1 font-display text-3xl font-bold text-dark-900 tracking-tight">
                        My Resumes
                    </h1>
                    <p className="mt-1 text-sm text-dark-500">
                        Upload, manage, and download tailored versions of your resume with AI optimization.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => inputRef.current?.click()}
                        isLoading={isUploading}
                        variant="primary"
                        className="shadow-md shadow-primary-500/20"
                    >
                        <UploadCloud className="h-4 w-4" />
                        <span>Upload New Resume</span>
                    </Button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700 flex items-center gap-2">
                    <span>{error}</span>
                </div>
            )}

            {!error && resumes.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-dark-200 shadow-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-dark-900 mb-2">No resumes uploaded yet</h3>
                    <p className="text-dark-500 text-sm max-w-md mb-6">
                        Upload your existing PDF or Word resume. Our AI parser will read your experience, skills, and structure.
                    </p>
                    <Button onClick={() => inputRef.current?.click()} variant="primary">
                        <Plus className="w-4 h-4" /> Upload your first resume
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume) => {
                        const score = resume.optimization?.atsScore || 0;
                        const isScoreGood = score >= 75;
                        return (
                            <Card
                                key={resume._id}
                                hover
                                className="flex flex-col justify-between gap-5 p-5 relative group border-dark-200/80 hover:border-primary-300 transition-all duration-300"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-start gap-3.5">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 shrink-0 group-hover:scale-105 transition-transform">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h2 className="truncate text-base font-bold text-dark-900 group-hover:text-primary-600 transition-colors" title={resume.title}>
                                                {resume.title}
                                            </h2>
                                            <p className="text-xs text-dark-400 mt-0.5 font-mono">
                                                Updated {formatDate(resume.updatedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ATS Score Progress */}
                                    <div className="mt-5 p-3 rounded-xl bg-dark-50/70 border border-dark-100/80">
                                        <div className="mb-2 flex items-center justify-between text-xs">
                                            <span className="font-medium text-dark-600 flex items-center gap-1">
                                                <TrendingUp className="w-3.5 h-3.5 text-primary-500" /> ATS Match
                                            </span>
                                            <span className={`font-mono font-bold text-sm ${isScoreGood ? 'text-emerald-600' : 'text-dark-900'}`}>
                                                {score}<span className="text-xs text-dark-400 font-normal">/100</span>
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-dark-200">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${
                                                    isScoreGood
                                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                                        : 'bg-gradient-to-r from-primary-500 to-accent-500'
                                                }`}
                                                style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-2 pt-3 border-t border-dark-100 flex items-center gap-2">
                                    <Button
                                        onClick={() => handleDownload(resume)}
                                        isLoading={downloadingId === resume._id}
                                        variant="secondary"
                                        size="sm"
                                        className="flex-1 text-xs"
                                        title="Download PDF"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        <span>Download</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(resumeDetailPath(resume._id))}
                                        className="text-xs hover:bg-primary-50 hover:text-primary-700"
                                        title="Preview resume details"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}
                                        className="text-xs text-accent-600 hover:bg-accent-50"
                                        title="Optimize with AI"
                                    >
                                        <Sparkles className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(resume._id, resume.title)}
                                        className="text-xs text-dark-400 hover:text-danger-600 hover:bg-danger-50"
                                        title="Delete resume"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
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
