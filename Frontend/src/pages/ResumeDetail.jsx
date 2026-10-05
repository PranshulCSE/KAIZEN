import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Download,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Target,
  CheckCircle2,
  AlertCircle,
  LayoutTemplate
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext.jsx';
import { useResume } from '../hooks/useResumes.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ScoreGauge from '../components/ui/ScoreGauge.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';
import { ROUTES, resumeBuilderPath } from '../constants/routes.js';

export default function ResumeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { resume, isLoading, error, downloadPdf } = useResume(id);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadPdf({ template: selectedTemplate });
      toast.success(
        `Resume downloaded (${selectedTemplate === 'modern' ? 'Modern Tech' : 'Harvard Classic'} ATS)!`
      );
    } catch (err) {
      toast.error(err.message || 'Could not download resume PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <PageLoader label="Loading resume preview..." />;
  if (error || !resume) {
    return (
      <EmptyState
        title="Resume not found"
        description={error || 'This resume may have been removed.'}
        action={
          <Button as={Link} to={ROUTES.RESUMES} variant="primary">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to library</span>
          </Button>
        }
      />
    );
  }

  const { content = {}, optimization } = resume;
  const personal = content.personalInfo || {};
  const atsScore = optimization?.atsScore || 0;

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-dark-200/80 dark:border-dark-800">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.RESUMES}
            className="p-2 rounded-xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800 shadow-2xs transition-all"
            title="Back to resumes"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/70 px-2.5 py-0.5 rounded-md border border-primary-200/80 dark:border-primary-800">
                Resume Overview
              </span>
              {optimization && (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-200/80 dark:border-emerald-800 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Optimized
                </span>
              )}
            </div>
            <h1 className="mt-1 font-display text-2xl sm:text-3xl text-dark-900 dark:text-white font-bold tracking-tight">
              {resume.title}
            </h1>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5 font-mono">
              Last updated {formatDate(resume.updatedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-dark-100 dark:bg-dark-800 p-1 rounded-xl border border-dark-200/80 dark:border-dark-700 text-xs">
            <button
              type="button"
              onClick={() => setSelectedTemplate('modern')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedTemplate === 'modern'
                  ? 'bg-white dark:bg-dark-900 text-primary-700 dark:text-primary-400 shadow-2xs'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              Modern Tech
            </button>
            <button
              type="button"
              onClick={() => setSelectedTemplate('classic')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedTemplate === 'classic'
                  ? 'bg-white dark:bg-dark-900 text-primary-700 dark:text-primary-400 shadow-2xs'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              Harvard Classic
            </button>
          </div>

          <Button
            onClick={handleDownload}
            variant="secondary"
            isLoading={isDownloading}
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </Button>

          <Link
            to={resumeBuilderPath(resume._id)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-xs font-bold text-dark-800 dark:text-dark-100 hover:bg-dark-50 dark:hover:bg-dark-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>Visual Builder</span>
          </Link>

          <Button
            onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}
            variant="primary"
          >
            <Target className="w-4 h-4" />
            <span>Target a Job</span>
          </Button>
        </div>
      </div>

      {/* Score & Profile Header Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Personal Information */}
        <Card className="p-6 lg:col-span-2 border-dark-200/80 dark:border-dark-800">
          <div className="flex items-center justify-between pb-4 border-b border-dark-100 dark:border-dark-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-100 dark:border-primary-800">
                <User className="w-5 h-5" />
              </div>
              <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Personal Details</h2>
            </div>
            <span className="text-xs font-mono text-dark-400 dark:text-dark-500">Parsed by Kaizen</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <InfoItem
              icon={User}
              label="Full Name"
              value={[personal.name, personal.fullName].find((v) => v && v !== 'Unknown') || user?.name || 'Candidate'}
            />
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={personal.email}
              isLink={personal.email ? `mailto:${personal.email}` : null}
            />
            <InfoItem icon={Phone} label="Phone Number" value={personal.phone} />
            <InfoItem icon={MapPin} label="Location" value={personal.location} />
          </div>

          {personal.summary && (
            <div className="mt-5 pt-4 border-t border-dark-100 dark:border-dark-800">
              <span className="text-xs font-bold uppercase tracking-wider text-dark-500 dark:text-dark-400 block mb-2 font-mono">
                Professional Summary
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-dark-700 dark:text-dark-300 bg-dark-50/60 dark:bg-dark-950 p-4 rounded-xl border border-dark-200/60 dark:border-dark-800">
                {personal.summary}
              </p>
            </div>
          )}
        </Card>

        {/* ATS Gauge Card */}
        <Card className="p-6 flex flex-col items-center justify-center text-center relative overflow-hidden border-dark-200/80 dark:border-dark-800">
          <ScoreGauge score={atsScore} size={110} label="ATS Match Score" />

          <div className="mt-4">
            <p className="text-xs font-bold text-dark-800 dark:text-dark-200">
              {atsScore >= 75
                ? 'Optimal ATS Ready'
                : atsScore >= 50
                ? 'Good foundation, needs refinement'
                : 'Needs keyword targeting'}
            </p>
            <p className="text-[11px] text-dark-500 dark:text-dark-400 mt-1 max-w-[220px] mx-auto font-mono">
              {optimization?.lastOptimized
                ? `Last calibrated ${formatDate(optimization.lastOptimized)}`
                : 'Match against a job posting to boost your score'}
            </p>
          </div>

          <Button
            onClick={() => navigate(`${ROUTES.OPTIMIZE}?resumeId=${resume._id}`)}
            variant="ghost"
            size="sm"
            className="mt-4 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Optimize Against a Job</span>
          </Button>
        </Card>
      </div>

      {/* AI Optimization Suggestions (if available) */}
      {optimization?.suggestions?.length > 0 ? (
        <Card className="p-6 border-l-4 border-l-primary-500 dark:border-l-primary-400 border-dark-200/80 dark:border-dark-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">ATS Recommendations</h2>
            </div>
            <Badge tone="accent">Actionable Advice</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {optimization.suggestions.map((s, i) => {
              const isObj = s && typeof s === 'object';
              const priority = isObj ? s.priority : null;
              const category = isObj ? s.category : null;
              const text = isObj ? s.reason || s.suggestion || s.text : s;
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-dark-200/70 dark:border-dark-800 bg-white dark:bg-dark-900 shadow-2xs flex flex-col justify-between gap-2 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={priority === 'high' ? 'high' : priority === 'medium' ? 'medium' : 'low'}>
                      {priority ? `${priority.toUpperCase()} PRIORITY` : `RECOMMENDATION ${i + 1}`}
                    </Badge>
                    {category && (
                      <span className="text-xs font-mono font-medium text-dark-500 dark:text-dark-400">
                        {category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </Card>
      ) : null}

      {/* Skills Showcase */}
      {content.skills?.length > 0 && (
        <Card className="p-6 border-dark-200/80 dark:border-dark-800">
          <div className="flex items-center gap-2.5 pb-4 border-b border-dark-100 dark:border-dark-800 mb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Extracted Skills</h2>
              <p className="text-xs text-dark-500 dark:text-dark-400 font-mono">
                {content.skills.length} competencies identified in resume
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-dark-50 dark:bg-dark-800 text-dark-800 dark:text-dark-200 border border-dark-200 dark:border-dark-700 hover:border-primary-300 transition-colors shadow-2xs"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Experience Section */}
      {content.experience?.length > 0 && (
        <Card className="p-6 border-dark-200/80 dark:border-dark-800">
          <div className="flex items-center gap-2.5 pb-4 border-b border-dark-100 dark:border-dark-800 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center border border-primary-100 dark:border-primary-800">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">Work Experience</h2>
              <p className="text-xs text-dark-500 dark:text-dark-400 font-mono">Verified career history</p>
            </div>
          </div>

          <div className="divide-y divide-dark-100 dark:divide-dark-800">
            {content.experience.map((exp, i) => (
              <div key={i} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-dark-900 dark:text-white">{exp.role || 'Role'}</h3>
                    <p className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {exp.company || 'Company'}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-lg bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300">
                    {exp.startDate ? formatDate(exp.startDate) : ''} —{' '}
                    {exp.isCurrent ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
                  </span>
                </div>
                {exp.bulletPoints?.length > 0 && (
                  <ul className="mt-3 space-y-2 pl-2 text-xs sm:text-sm text-dark-700 dark:text-dark-300">
                    {exp.bulletPoints.map((bp, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                        <span className="leading-relaxed">{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Education Section */}
      {content.education?.length > 0 && (
        <Card className="p-6 border-dark-200/80 dark:border-dark-800">
          <div className="flex items-center gap-2.5 pb-4 border-b border-dark-100 dark:border-dark-800 mb-5">
            <div className="w-9 h-9 rounded-xl bg-accent-50 dark:bg-accent-950/70 text-accent-600 dark:text-accent-400 flex items-center justify-center border border-accent-100 dark:border-accent-800">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-dark-900 dark:text-white">
                Education & Qualifications
              </h2>
              <p className="text-xs text-dark-500 dark:text-dark-400 font-mono">Academic background</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.education.map((edu, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-dark-200/70 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950"
              >
                <p className="font-bold text-dark-900 dark:text-white text-sm">
                  {edu.degree} {edu.field && `· ${edu.field}`}
                </p>
                <p className="text-xs text-primary-700 dark:text-primary-300 font-semibold mt-1">
                  {edu.institution}
                </p>
                {edu.endYear && (
                  <p className="text-xs font-mono text-dark-400 dark:text-dark-500 mt-2">
                    Graduated: {edu.endYear}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, isLink }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-50/50 dark:bg-dark-950/60 border border-dark-200/60 dark:border-dark-800">
      <div className="p-2 rounded-lg bg-white dark:bg-dark-900 text-dark-500 dark:text-dark-400 shrink-0 border border-dark-200/60 dark:border-dark-800">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono text-dark-400 dark:text-dark-500 uppercase tracking-wider font-bold">
          {label}
        </p>
        {isLink && value ? (
          <a
            href={isLink}
            className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline truncate block"
          >
            {value}
          </a>
        ) : (
          <p className="text-xs sm:text-sm font-semibold text-dark-800 dark:text-dark-200 truncate">
            {value || '—'}
          </p>
        )}
      </div>
    </div>
  );
}
