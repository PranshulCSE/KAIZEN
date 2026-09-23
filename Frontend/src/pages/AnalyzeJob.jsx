import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { useAI } from '../hooks/useAI.js';
import { jobAnalysisDetailPath } from '../constants/routes.js';

export default function AnalyzeJob() {
    const navigate = useNavigate();
    const { resumes } = useResumes();
    const { analyzeJob, status } = useAI();
    const [jobUrl, setJobUrl] = useState('');
    const [isScraping, setIsScraping] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    const handleScrape = async () => {
        if (!jobUrl.trim()) {
            toast.error('Please enter a job URL');
            return;
        }
        setIsScraping(true);
        try {
            const { data } = await aiApi.scrapeJobUrl({ url: jobUrl.trim() });
            if (data?.data?.text) {
                setValue('jobDescription', data.data.text);
                if (data.data.title) setValue('jobTitle', data.data.title);
                if (data.data.company) setValue('company', data.data.company);
                toast.success('Job details extracted from URL!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to extract job from URL');
        } finally {
            setIsScraping(false);
        }
    };

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const analysis = await analyzeJob(values);
            toast.success('Job analyzed.');
            navigate(jobAnalysisDetailPath(analysis._id));
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-8 pb-12 animate-fade-in">
            <div>
                <span className="eyebrow">New analysis</span>
                <h1 className="mt-2 font-display text-3xl text-ink">Break down a job description</h1>
                <p className="mt-2 text-sm text-ink-muted">
                    Paste the full listing or auto-fetch directly from a job URL. Kaizen pulls out the required skills, keywords, and ATS weights.
                </p>
            </div>

            <Card className="p-6 space-y-4">
                {/* 1-Click URL Importer */}
                <div className="p-3.5 rounded-xl bg-primary-50/60 border border-primary-100 space-y-2">
                    <label className="text-xs font-bold text-primary-900 block">
                        ✦ 1-Click Auto-Fetch from URL (LinkedIn, Indeed, Lever, etc.)
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            placeholder="https://www.linkedin.com/jobs/view/..."
                            value={jobUrl}
                            onChange={(e) => setJobUrl(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs rounded-lg border border-primary-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleScrape}
                            isLoading={isScraping}
                            className="text-xs whitespace-nowrap"
                        >
                            <span>Fetch Text</span>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="Job title" placeholder="Senior Product Manager" {...register('jobTitle')} />
                        <Input label="Company" placeholder="Acme Corp" {...register('company')} />
                    </div>

                    {resumes.length > 0 && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-ink">Link to a resume (optional)</label>
                            <select
                                {...register('resumeId')}
                                className="rounded border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-improve focus:outline-none"
                            >
                                <option value="">None</option>
                                {resumes.map((r) => (
                                    <option key={r._id} value={r._id}>
                                        {r.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <Textarea
                        label="Job description"
                        rows={10}
                        placeholder="Paste the full job description here…"
                        error={errors.jobDescription?.message}
                        {...register('jobDescription', { required: 'Paste the job description first' })}
                    />

                    <Button type="submit" isLoading={isSubmitting || status.analyzeJob.isLoading} className="w-full">
                        Analyze this job
                    </Button>
                </form>
            </Card>
        </div>
    );
}
