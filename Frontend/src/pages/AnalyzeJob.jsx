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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

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
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
            <div>
                <span className="eyebrow">New analysis</span>
                <h1 className="mt-2 font-display text-3xl text-ink">Break down a job description</h1>
                <p className="mt-2 text-sm text-ink-muted">
                    Paste the full listing. Kaizen pulls out the required skills, keywords, and what the role
                    actually expects.
                </p>
            </div>

            <Card className="p-6">
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
