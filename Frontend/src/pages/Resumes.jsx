import React, { useRef, useState } from 'react';
import { Download, Eye, Trash2, UploadCloud, FileText, Plus, TrendingUp, Target, Sparkles } from 'lucide-react';
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

  if (isLoading) return <PageLoader label="Loading resume library..." />;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="hidden" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-dark-200/80 dark:border-dark-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 px-2.5 py-0.5 rounded-md border border-primary-200/80 dark:border-primary-800">
              Document Library
            </span>
            <span className="text-xs font-medium text-dark-500 dark:text-dark-400 font-mono">
              {resumes.length} {resumes.length === 1 ? 'version' : 'versions'} saved
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold text-dark-900 dark:text-white tracking-tight">
            My Resumes
          </h1>
          <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
            Upload, manage, and download tailored versions of your resume with AI optimization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => inputRef.current?.click()}
            isLoading={isUploading}
            variant="primary"
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload New Resume</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {!error && resumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resumes uploaded yet"
          description="Upload your existing PDF or Word resume. Our parser will read your experience, skills, and structure."
          action={
            <Button onClick={() => inputRef.current?.click()} variant="primary">
              <Plus className="w-4 h-4" />
              <span>Upload your first resume</span>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => {
            const score = resume.optimization?.atsScore || 0;
            const isScoreGood = score >= 75;
            return (
              <Card
                key={resume._id}
                hover
                className="flex flex-col justify-between gap-5 p-5 relative group border-dark-200/80 dark:border-dark-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-200"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 shrink-0 group-hover:scale-105 transition-transform border border-primary-100 dark:border-primary-800">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2
                        className="truncate text-base font-bold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                        title={resume.title}
                      >
                        {resume.title}
                      </h2>
                      <p className="text-xs text-dark-400 dark:text-dark-500 mt-0.5 font-mono">
                        Updated {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* ATS Score Progress */}
                  <div className="mt-5 p-3.5 rounded-xl bg-dark-50/70 dark:bg-dark-800/60 border border-dark-200/60 dark:border-dark-700/60">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-dark-700 dark:text-dark-300 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
                        <span>ATS Match</span>
                      </span>
                      <span
                        className={`font-mono font-bold text-sm ${
                          isScoreGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-dark-900 dark:text-white'
                        }`}
                      >
                        {score}
                        <span className="text-xs text-dark-400 dark:text-dark-500 font-normal">/100</span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-dark-200 dark:bg-dark-700">
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
                <div className="mt-2 pt-3 border-t border-dark-100 dark:border-dark-800 flex items-center gap-2">
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
                    className="text-xs"
                    title="Preview resume details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40"
                    title="Optimize with AI"
                  >
                    <Target className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(resume._id, resume.title)}
                    className="text-xs text-dark-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
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
