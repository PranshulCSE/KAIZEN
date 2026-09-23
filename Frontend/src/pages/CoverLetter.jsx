import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  Download,
  Send,
  Linkedin,
  MessageSquare,
  Globe,
  FileText,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  RefreshCw,
  Sliders,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { useJobAnalyses } from '../hooks/useJobAnalyses.js';
import { aiApi } from '../api/ai.api.js';

export default function CoverLetter() {
  const { resumes, isLoading: resumesLoading } = useResumes();
  const { analyses, isLoading: analysesLoading } = useJobAnalyses();
  const location = useLocation();

  // Mode: 'cover-letter' | 'cold-outreach'
  const [activeTab, setActiveTab] = useState('cover-letter');

  // Input states
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customJobDesc, setCustomJobDesc] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [extraNotes, setExtraNotes] = useState('');

  // Options
  const [tone, setTone] = useState('confident');
  const [target, setTarget] = useState('hiring_manager');
  const [platform, setPlatform] = useState('linkedin_inmail');

  // Results & Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterResult, setCoverLetterResult] = useState(null);
  const [outreachResult, setOutreachResult] = useState(null);
  const [copiedField, setCopiedField] = useState('');

  // Pre-select first resume when loaded
  useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [resumes, selectedResumeId]);

  // Handle URL pre-fill from navigation state
  useEffect(() => {
    if (location.state?.resumeId) {
      setSelectedResumeId(location.state.resumeId);
    }
    if (location.state?.jobAnalysisId) {
      setSelectedJobId(location.state.jobAnalysisId);
    }
  }, [location.state]);

  const handleScrapeUrl = async () => {
    if (!jobUrl.trim()) {
      toast.error('Please enter a valid job posting URL.');
      return;
    }
    setIsScraping(true);
    try {
      const { data } = await aiApi.scrapeJobUrl({ url: jobUrl.trim() });
      if (data?.data?.text) {
        setCustomJobDesc(data.data.text);
        if (data.data.title && !customJobTitle) setCustomJobTitle(data.data.title);
        if (data.data.company && !customCompany) setCustomCompany(data.data.company);
        toast.success('Job description extracted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to extract job from URL');
    } finally {
      setIsScraping(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first.');
      return;
    }
    if (!selectedJobId && !customJobDesc.trim()) {
      toast.error('Please select a job target or paste a job description.');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        resumeId: selectedResumeId,
        jobAnalysisId: selectedJobId || undefined,
        jobDescription: !selectedJobId ? customJobDesc : undefined,
        jobTitle: customJobTitle || undefined,
        company: customCompany || undefined,
        tone,
        target,
        extraNotes: extraNotes.trim() || undefined
      };

      const { data } = await aiApi.generateCoverLetter(payload);
      setCoverLetterResult(data.data);
      toast.success('Tailored cover letter generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateColdOutreach = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first.');
      return;
    }
    if (!selectedJobId && !customJobDesc.trim()) {
      toast.error('Please select a job target or paste a job description.');
      return;
    }

    setIsGenerating(true);
    try {
      const payload = {
        resumeId: selectedResumeId,
        jobAnalysisId: selectedJobId || undefined,
        jobDescription: !selectedJobId ? customJobDesc : undefined,
        jobTitle: customJobTitle || undefined,
        company: customCompany || undefined,
        platform,
        recipientRole: target === 'founder' ? 'Founder' : target === 'recruiter' ? 'Technical Recruiter' : 'Hiring Manager'
      };

      const { data } = await aiApi.generateColdOutreach(payload);
      setOutreachResult(data.data);
      toast.success('Networking outreach kit generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to generate outreach');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedField(''), 2500);
  };

  const downloadTextFile = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (resumesLoading || analysesLoading) {
    return <PageLoader label="Loading cover letter engine" />;
  }

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-950 via-primary-900 to-indigo-950 p-8 text-white shadow-xl shadow-primary-950/10">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-primary-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>AI Application Suite</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
              Cover Letter & Outreach Generator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-primary-200/90 leading-relaxed">
              Craft persuasive, recruiter-tailored cover letters and high-converting LinkedIn networking messages grounded in your verified experience.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('cover-letter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cover-letter'
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                  : 'text-primary-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Cover Letter</span>
            </button>
            <button
              onClick={() => setActiveTab('cold-outreach')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cold-outreach'
                  ? 'bg-accent-500 text-ink shadow-md shadow-accent-500/30'
                  : 'text-primary-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Cold Outreach</span>
            </button>
          </div>
        </div>

        {/* Background glow effects */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls & Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-dark-100/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-dark-100">
              <h2 className="text-base font-bold font-display text-dark-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary-600" />
                <span>Configuration</span>
              </h2>
              <span className="text-xs font-mono text-dark-400">Step 1 of 2</span>
            </div>

            {/* Resume Selection */}
            <div>
              <label className="block text-xs font-bold text-dark-700 uppercase tracking-wider mb-2">
                1. Select Source Resume
              </label>
              {resumes.length === 0 ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  No resumes found. Please upload a resume first to use this generator.
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 bg-white text-dark-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium"
                >
                  {resumes.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.title} ({r.optimization?.atsScore || 0}% ATS)
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Target Job Selection / Input */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-dark-700 uppercase tracking-wider">
                2. Target Job Description
              </label>

              {analyses.length > 0 && (
                <div>
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      if (e.target.value) {
                        const targetItem = analyses.find((a) => a._id === e.target.value);
                        if (targetItem) {
                          setCustomJobTitle(targetItem.jobTitle || '');
                          setCustomCompany(targetItem.company || '');
                          setCustomJobDesc('');
                        }
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 bg-white text-dark-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium mb-2"
                  >
                    <option value="">-- Choose from analyzed jobs (or paste custom) --</option>
                    {analyses.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.jobTitle || 'Role'} at {a.company || 'Company'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Scrape from URL Accordion / Input */}
              {!selectedJobId && (
                <div className="space-y-3 pt-1">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste Job URL (LinkedIn, Indeed, etc.)"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
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

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Job Title (e.g. Senior Frontend Dev)"
                      value={customJobTitle}
                      onChange={(e) => setCustomJobTitle(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Company (e.g. Stripe)"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      className="px-3 py-2 text-xs rounded-lg border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Or paste full job description text here..."
                    value={customJobDesc}
                    onChange={(e) => setCustomJobDesc(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono"
                  />
                </div>
              )}
            </div>

            {/* Tone & Recipient Pickers */}
            <div className="space-y-4 pt-2 border-t border-dark-100">
              <div>
                <label className="block text-xs font-bold text-dark-700 uppercase tracking-wider mb-2">
                  Tone Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'confident', label: 'Confident', desc: 'Authoritative' },
                    { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Passionate' },
                    { id: 'professional', label: 'Professional', desc: 'Structured' },
                    { id: 'direct', label: 'Direct', desc: 'Punchy' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        tone === t.id
                          ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold shadow-2xs'
                          : 'border-dark-100 bg-dark-50/50 text-dark-600 hover:bg-dark-100/50'
                      }`}
                    >
                      <p className="text-xs font-semibold">{t.label}</p>
                      <p className="text-[10px] text-dark-400 font-mono mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 uppercase tracking-wider mb-2">
                  Target Recipient
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hiring_manager', label: 'Hiring Manager' },
                    { id: 'recruiter', label: 'HR / Recruiter' },
                    { id: 'founder', label: 'Founder / CEO' },
                    { id: 'engineering_lead', label: 'Engineering Lead' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setTarget(r.id)}
                      className={`px-3 py-2 rounded-xl border text-xs text-left transition-all ${
                        target === r.id
                          ? 'border-primary-600 bg-primary-50 text-primary-900 font-bold'
                          : 'border-dark-100 bg-dark-50/50 text-dark-600 hover:bg-dark-100/50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'cold-outreach' && (
                <div>
                  <label className="block text-xs font-bold text-dark-700 uppercase tracking-wider mb-2">
                    Outreach Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'linkedin_connect', label: 'Connection Note', icon: Linkedin },
                      { id: 'linkedin_inmail', label: 'InMail', icon: MessageSquare },
                      { id: 'email', label: 'Cold Email', icon: Mail }
                    ].map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPlatform(p.id)}
                          className={`p-2.5 rounded-xl border text-xs flex flex-col items-center gap-1.5 transition-all ${
                            platform === p.id
                              ? 'border-accent-600 bg-accent-50 text-accent-950 font-bold'
                              : 'border-dark-100 bg-dark-50/50 text-dark-600 hover:bg-dark-100/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-dark-700 uppercase tracking-wider mb-1.5">
                  Custom Focus / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Highlight my 3 years of Kubernetes & Golang experience"
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2">
              <Button
                variant={activeTab === 'cover-letter' ? 'lime' : 'primary'}
                size="lg"
                className="w-full font-bold shadow-lg justify-center text-sm"
                onClick={activeTab === 'cover-letter' ? handleGenerateCoverLetter : handleGenerateColdOutreach}
                isLoading={isGenerating}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {activeTab === 'cover-letter' ? 'Generate Tailored Cover Letter' : 'Generate Outreach Messages'}
                </span>
              </Button>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Output & Preview */}
        <div className="lg:col-span-7">
          {activeTab === 'cover-letter' ? (
            /* COVER LETTER PREVIEW */
            <div className="space-y-6">
              {!coverLetterResult ? (
                <div className="rounded-2xl border-2 border-dashed border-dark-200 bg-white p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold font-display text-dark-900 mb-1">
                    No Cover Letter Generated Yet
                  </h3>
                  <p className="text-xs text-dark-500 max-w-sm mx-auto leading-relaxed">
                    Select your resume, target job, and tone settings on the left, then click Generate to create a bespoke cover letter.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-scale-in">
                  {/* Result Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-dark-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Narrative Fit: {coverLetterResult.matchingScore || 92}%</span>
                      </div>
                      <span className="text-xs font-mono text-dark-400 hidden sm:inline">
                        Tone: {tone}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(coverLetterResult.fullLetter, 'letter')}
                        className="text-xs"
                      >
                        {copiedField === 'letter' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Letter</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadTextFile(coverLetterResult.fullLetter, `Cover_Letter_${customCompany || 'Job'}.txt`)}
                        className="text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .txt</span>
                      </Button>
                    </div>
                  </div>

                  {/* Key Highlights Card */}
                  {coverLetterResult.keyHighlights?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-100">
                      <p className="text-xs font-bold text-primary-900 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                        <span>Key Alignment Points Included:</span>
                      </p>
                      <ul className="grid sm:grid-cols-3 gap-2">
                        {coverLetterResult.keyHighlights.map((hl, i) => (
                          <li key={i} className="text-[11px] text-primary-800 bg-white/80 rounded-lg p-2 border border-primary-100/80">
                            • {hl}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Letter Paper Render */}
                  <div className="rounded-2xl bg-white border border-dark-200/90 shadow-lg p-8 sm:p-10 font-serif leading-relaxed text-dark-900 space-y-5">
                    {/* Subject Line */}
                    {coverLetterResult.subject && (
                      <div className="pb-4 border-b border-dark-100 font-sans">
                        <span className="text-xs font-mono font-bold text-dark-400 uppercase tracking-wider block mb-1">
                          Subject Line
                        </span>
                        <p className="text-sm font-bold text-dark-800 font-sans">
                          {coverLetterResult.subject}
                        </p>
                      </div>
                    )}

                    {/* Salutation */}
                    <p className="text-sm font-bold pt-2">
                      {coverLetterResult.salutation}
                    </p>

                    {/* Opening */}
                    <p className="text-sm text-dark-800">
                      {coverLetterResult.openingParagraph}
                    </p>

                    {/* Body 1 */}
                    <p className="text-sm text-dark-800">
                      {coverLetterResult.bodyParagraph1}
                    </p>

                    {/* Body 2 */}
                    {coverLetterResult.bodyParagraph2 && (
                      <p className="text-sm text-dark-800">
                        {coverLetterResult.bodyParagraph2}
                      </p>
                    )}

                    {/* Closing */}
                    <p className="text-sm text-dark-800">
                      {coverLetterResult.closingParagraph}
                    </p>

                    {/* Signoff */}
                    <div className="pt-4 whitespace-pre-line text-sm font-bold text-dark-900">
                      {coverLetterResult.signoff}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* COLD OUTREACH PREVIEW */
            <div className="space-y-6">
              {!outreachResult ? (
                <div className="rounded-2xl border-2 border-dashed border-dark-200 bg-white p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold font-display text-dark-900 mb-1">
                    No Outreach Kit Generated Yet
                  </h3>
                  <p className="text-xs text-dark-500 max-w-sm mx-auto leading-relaxed">
                    Choose your target recipient and format on the left to generate personalized LinkedIn notes, InMails, and follow-up email templates.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-scale-in">
                  {/* LinkedIn Connection Note (<300 chars) */}
                  <div className="rounded-2xl bg-white border border-dark-100 p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                        <h3 className="text-sm font-bold text-dark-900">
                          LinkedIn Connection Request Note
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-dark-100 text-dark-600">
                        {outreachResult.connectionNote?.length || 0} / 300 chars
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-dark-50 border border-dark-100 text-xs font-mono text-dark-800 leading-relaxed">
                      {outreachResult.connectionNote}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(outreachResult.connectionNote, 'conn')}
                        className="text-xs"
                      >
                        {copiedField === 'conn' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Note</span>
                      </Button>
                    </div>
                  </div>

                  {/* Full InMail / Cold Email Message */}
                  <div className="rounded-2xl bg-white border border-dark-100 p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary-600" />
                        <h3 className="text-sm font-bold text-dark-900">
                          Main Outreach Message (InMail / Email)
                        </h3>
                      </div>
                    </div>

                    {outreachResult.subject && (
                      <div className="p-3 rounded-xl bg-primary-50/50 border border-primary-100">
                        <span className="text-[10px] font-mono font-bold text-primary-700 uppercase tracking-wider block">
                          Subject Line:
                        </span>
                        <p className="text-xs font-bold text-dark-900 mt-0.5">
                          {outreachResult.subject}
                        </p>
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-dark-50 border border-dark-100 text-xs text-dark-800 whitespace-pre-line leading-relaxed font-sans">
                      {outreachResult.message}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(outreachResult.message, 'mainMsg')}
                        className="text-xs"
                      >
                        {copiedField === 'mainMsg' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Message</span>
                      </Button>
                    </div>
                  </div>

                  {/* Follow-up Template */}
                  {outreachResult.followUpTemplate && (
                    <div className="rounded-2xl bg-white border border-dark-100 p-6 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-accent-600" />
                          <h3 className="text-sm font-bold text-dark-900">
                            4-Day Follow-Up Message
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-dark-50 border border-dark-100 text-xs text-dark-800 whitespace-pre-line leading-relaxed">
                        {outreachResult.followUpTemplate}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(outreachResult.followUpTemplate, 'follow')}
                          className="text-xs"
                        >
                          {copiedField === 'follow' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copy Follow-up</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Strategy Tips */}
                  {outreachResult.strategyTips?.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <p className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600" />
                        <span>Networking Best Practices:</span>
                      </p>
                      <ul className="space-y-1">
                        {outreachResult.strategyTips.map((tip, i) => (
                          <li key={i} className="text-xs text-amber-800">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
