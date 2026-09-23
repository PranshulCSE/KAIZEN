import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Download,
  AlertCircle,
  TrendingUp,
  Layers,
  Globe,
  LayoutTemplate,
  Sliders,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Badge from '../components/ui/Badge.jsx';
import ScoreGauge from '../components/ui/ScoreGauge.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { useAI } from '../hooks/useAI.js';
import { aiApi } from '../api/ai.api.js';
import { ROUTES, resumeBuilderPath } from '../constants/routes.js';

export default function Optimize() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { resumes, downloadResume } = useResumes();
    const { optimizeResume, status } = useAI();

    const [selectedResumeId, setSelectedResumeId] = useState(searchParams.get('resumeId') || '');
    const [jobDescription, setJobDescription] = useState('');
    const [jobUrl, setJobUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const [optimizationResult, setOptimizationResult] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Template & Color for Download
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [selectedColor, setSelectedColor] = useState('#2563EB');

    // If query params passed a resumeId, sync it
    useEffect(() => {
        const paramId = searchParams.get('resumeId');
        if (paramId && (!selectedResumeId || selectedResumeId !== paramId)) {
            setSelectedResumeId(paramId);
        } else if (!selectedResumeId && resumes.length > 0) {
            setSelectedResumeId(resumes[0]._id);
        }
    }, [searchParams, resumes]);

    const handleScrapeUrl = async () => {
        if (!jobUrl.trim()) {
            toast.error('Please paste a job URL first.');
            return;
        }
        setIsScraping(true);
        try {
            const { data } = await aiApi.scrapeJobUrl({ url: jobUrl.trim() });
            if (data?.data?.text) {
                setJobDescription(data.data.text);
                toast.success('Job description auto-fetched!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to fetch job posting');
        } finally {
            setIsScraping(false);
        }
    };

    const handleOptimize = async () => {
        if (!selectedResumeId) {
            toast.error('Please select a resume to optimize.');
            return;
        }
        if (!jobDescription.trim() || jobDescription.length < 50) {
            toast.error('Please provide a job description (at least 50 characters).');
            return;
        }

        try {
            const res = await optimizeResume({
                resumeId: selectedResumeId,
                jobDescription: jobDescription.trim()
            });
            const opt = res?.optimization || res;
            setOptimizationResult(opt);
            toast.success('Resume optimized successfully!');
        } catch (err) {
            toast.error(err.message || 'Optimization failed. Please try again.');
        }
    };

    const handleDownloadOptimized = async () => {
        if (!selectedResumeId) return;
        setIsDownloading(true);
        try {
            const currentResume = resumes.find(r => r._id === selectedResumeId);
            await downloadResume(selectedResumeId, `${currentResume?.title || 'resume'}-optimized`, {
                optimization: optimizationResult,
                template: selectedTemplate,
                accentColor: selectedColor
            });
            toast.success('Optimized PDF downloaded successfully!');
        } catch (err) {
            toast.error(err.message || 'Failed to download optimized PDF.');
        } finally {
            setIsDownloading(false);
        }
    };

    const isOptimizing = status.optimizeResume.isLoading;

    return (
        <div className="flex flex-col gap-8 pb-16 animate-fade-in">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-dark-100 dark:border-dark-800">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950 px-2 py-0.5 rounded-md">
                            AI Optimizer
                        </span>
                        <span className="text-xs font-semibold text-accent-700 dark:text-accent-300 bg-accent-50 dark:bg-accent-950 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-accent-500" /> ATS Targeted
                        </span>
                    </div>
                    <h1 className="mt-1 font-display text-3xl font-bold text-dark-900 dark:text-white tracking-tight">
                        Target & Optimize Resume
                    </h1>
                    <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                        Align your bullet points with any recruiter or ATS job requirements in seconds.
                    </p>
                </div>
            </div>

            {/* Input Section */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Step 1: Choose Resume */}
                <Card className="lg:col-span-5 p-6 flex flex-col justify-between gap-6 border-dark-100 dark:border-dark-800">
                    <div>
                        <div className="flex items-center gap-2.5 pb-3 border-b border-dark-100 dark:border-dark-800 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                                1
                            </div>
                            <h2 className="font-display text-base font-bold text-dark-900 dark:text-white">Choose Source Resume</h2>
                        </div>

                        {resumes.length === 0 ? (
                            <div className="p-6 text-center rounded-xl bg-dark-50 dark:bg-dark-950 border border-dark-200/80 dark:border-dark-800">
                                <FileText className="w-8 h-8 text-dark-400 mx-auto mb-2" />
                                <p className="text-xs text-dark-600 dark:text-dark-300 font-medium mb-3">No resumes uploaded yet.</p>
                                <Button as={Link} to={ROUTES.RESUMES} size="sm" variant="primary">
                                    Upload Resume First
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                                {resumes.map((r) => {
                                    const isSelected = selectedResumeId === r._id;
                                    const score = r.optimization?.atsScore || 0;
                                    return (
                                        <div
                                            key={r._id}
                                            onClick={() => setSelectedResumeId(r._id)}
                                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                                isSelected
                                                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/40 shadow-xs'
                                                    : 'border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 hover:border-dark-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-500 text-white' : 'bg-dark-100 dark:bg-dark-800 text-dark-500'}`}>
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary-900 dark:text-primary-200' : 'text-dark-800 dark:text-dark-200'}`}>
                                                        {r.title}
                                                    </p>
                                                    <p className="text-[10px] text-dark-400 font-mono">
                                                        ATS Score: {score}%
                                                    </p>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <CheckCircle2 className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-xl bg-accent-50/60 dark:bg-accent-950/30 border border-accent-200/60 dark:border-accent-900 text-xs text-accent-900 dark:text-accent-200 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
                        <span>Kaizen rewrites bullet points to highlight metrics, action verbs, and matching qualifications.</span>
                    </div>
                </Card>

                {/* Step 2: Paste Job Description */}
                <Card className="lg:col-span-7 p-6 flex flex-col justify-between gap-4 border-dark-100 dark:border-dark-800">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-dark-100 dark:border-dark-800">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-accent-50 dark:bg-accent-950 text-accent-600 dark:text-accent-400 flex items-center justify-center font-bold text-xs">
                                    2
                                </div>
                                <h2 className="font-display text-base font-bold text-dark-900 dark:text-white">Target Job Listing</h2>
                            </div>
                        </div>

                        {/* URL Auto-Scraper Bar */}
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="Paste Job URL (LinkedIn, Indeed, Lever, etc.)"
                                value={jobUrl}
                                onChange={(e) => setJobUrl(e.target.value)}
                                className="flex-1 px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white font-mono focus:ring-2 focus:ring-primary-500"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleScrapeUrl}
                                isLoading={isScraping}
                                className="text-xs whitespace-nowrap"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>Auto-Fetch</span>
                            </Button>
                        </div>

                        <Textarea
                            placeholder="Or paste the full job post, responsibilities, and required qualifications here..."
                            rows={8}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="text-xs"
                        />
                        <p className="text-[11px] text-dark-400 mt-1 font-mono">
                            {jobDescription.length} characters entered
                        </p>
                    </div>

                    <Button
                        onClick={handleOptimize}
                        isLoading={isOptimizing}
                        disabled={!selectedResumeId || !jobDescription.trim()}
                        variant="primary"
                        size="lg"
                        className="w-full shadow-lg shadow-primary-500/20 font-bold"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>{isOptimizing ? 'Analyzing & Rewriting Resume...' : 'Analyze & Optimize Now'}</span>
                    </Button>
                </Card>
            </div>

            {/* Step 3: Optimization Results (if available) */}
            {optimizationResult && (
                <div className="space-y-6 pt-6 border-t border-dark-100 dark:border-dark-800 animate-fade-up">
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 shadow-sm">
                        <div>
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                                Optimization Complete
                            </span>
                            <h2 className="text-xl font-black font-display text-dark-900 dark:text-white mt-1">
                                ATS Score & Line-by-Line Rewrites
                            </h2>
                        </div>

                        {/* Template & Color Selector for Download */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 p-1 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-100 dark:border-dark-700">
                                <span className="text-[10px] font-mono font-bold text-dark-400 pl-2">Layout:</span>
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => setSelectedTemplate(e.target.value)}
                                    className="text-xs font-semibold bg-transparent text-dark-800 dark:text-white pr-2 py-1 focus:outline-none cursor-pointer"
                                >
                                    <option value="modern" className="text-dark-900 dark:text-white dark:bg-dark-900">Modern Tech ATS</option>
                                    <option value="classic" className="text-dark-900 dark:text-white dark:bg-dark-900">Harvard Classic ATS</option>
                                </select>
                            </div>

                            <Link
                                to={resumeBuilderPath(selectedResumeId)}
                                className="px-3 py-2 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:bg-dark-50 dark:hover:bg-dark-800 text-xs font-bold text-dark-800 dark:text-white flex items-center gap-1.5 transition-colors"
                            >
                                <LayoutTemplate className="w-3.5 h-3.5 text-primary-600" />
                                <span>Edit in Visual Builder</span>
                            </Link>

                            <Button
                                onClick={handleDownloadOptimized}
                                isLoading={isDownloading}
                                variant="lime"
                                size="md"
                                className="shadow-md font-bold text-xs"
                            >
                                <Download className="w-3.5 h-3.5 text-ink" />
                                <span>Download PDF ({selectedTemplate})</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* ATS Score card */}
                        <Card className="p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-emerald-50/20 dark:from-dark-900 dark:to-emerald-950/20 border-dark-100 dark:border-dark-800">
                            <ScoreGauge score={optimizationResult.atsScore || 90} size={110} label="Target ATS Score" />
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold mt-3">High Interview Probability</p>
                            <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-1">
                                Keywords and responsibilities closely aligned.
                            </p>
                        </Card>

                        {/* Rewritten Summary */}
                        <Card className="p-6 lg:col-span-2 border-dark-100 dark:border-dark-800">
                            <h3 className="font-display text-base font-bold text-dark-900 dark:text-white mb-2">Tailored Professional Summary</h3>
                            <p className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed bg-dark-50/80 dark:bg-dark-950 p-4 rounded-xl border border-dark-100 dark:border-dark-800">
                                {optimizationResult.summaryRewrite || 'Optimized professional summary emphasizing target keywords and competencies.'}
                            </p>
                        </Card>
                    </div>

                    {/* Before & After Redlines */}
                    {optimizationResult.beforeAfter?.length > 0 && (
                        <Card className="p-6 border-dark-100 dark:border-dark-800">
                            <h3 className="font-display text-base font-bold text-dark-900 dark:text-white mb-4">Line-by-Line AI Enhancements</h3>
                            <div className="space-y-4">
                                {optimizationResult.beforeAfter.map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl border border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-2xs space-y-2">
                                        <div className="text-xs text-rose-600 dark:text-rose-400 line-through bg-rose-50/50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900">
                                            {item.before}
                                        </div>
                                        <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900">
                                            {item.after}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

