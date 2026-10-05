import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Globe, Briefcase, Search, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { useAI } from '../hooks/useAI.js';
import { aiApi } from '../api/ai.api.js';
import { jobAnalysisDetailPath, ROUTES } from '../constants/routes.js';

export default function AnalyzeJob() {
  const navigate = useNavigate();
  const { resumes } = useResumes();
  const { analyzeJob, status } = useAI();
  const [jobUrl, setJobUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toast.success('Job analyzed successfully!');
      navigate(jobAnalysisDetailPath(analysis._id));
    } catch (err) {
      toast.error(err.message || 'Failed to analyze job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 pb-12 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.JOB_ANALYSES}
          className="p-2 rounded-xl bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 text-dark-500 hover:text-dark-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-dark-900 dark:text-white">
            Deconstruct Job Description
          </h1>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            Extract hard technical requirements, preferred qualifications, and exact ATS matching keywords.
          </p>
        </div>
      </div>

      <Card className="p-6 sm:p-8 space-y-6 border-dark-100 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-sm">
        {/* 1-Click URL Importer */}
        <div className="p-4 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900 space-y-2.5">
          <label className="text-xs font-bold text-primary-900 dark:text-primary-200 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>1-Click Auto-Fetch from URL (LinkedIn, Indeed, Lever, Greenhouse, etc.)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://www.linkedin.com/jobs/view/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-primary-200 dark:border-primary-800 bg-white dark:bg-dark-900 text-dark-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleScrape}
              isLoading={isScraping}
              className="text-xs font-bold whitespace-nowrap"
            >
              <span>Auto-Fetch</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Target Job Title"
              placeholder="e.g. Senior Frontend Engineer"
              {...register('jobTitle')}
            />
            <Input
              label="Hiring Company"
              placeholder="e.g. Stripe, OpenAI, Google"
              {...register('company')}
            />
          </div>

          {resumes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300">
                Link to Resume (Optional)
              </label>
              <select
                {...register('resumeId')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <option value="" className="text-dark-900 dark:text-white dark:bg-dark-900">None (Analyze standalone)</option>
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} className="text-dark-900 dark:text-white dark:bg-dark-900">
                    {r.title} ({r.optimization?.atsScore || 0}% ATS)
                  </option>
                ))}
              </select>
            </div>
          )}

          <Textarea
            label="Full Job Description"
            rows={10}
            placeholder="Paste the full job description or requirements text here…"
            error={errors.jobDescription?.message}
            {...register('jobDescription', { required: 'Please provide the job description text.' })}
          />

          <Button
            type="submit"
            variant="lime"
            size="lg"
            isLoading={isSubmitting || status.analyzeJob.isLoading}
            className="w-full justify-center font-bold text-sm shadow-md"
          >
            <Search className="w-4 h-4 text-ink" />
            <span>Analyze Job Description & Extract Keywords</span>
          </Button>
        </form>
      </Card>
    </div>
  );
}
