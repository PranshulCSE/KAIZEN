import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import {
  Sparkles,
  Save,
  Download,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Sliders,
  Palette,
  Layout,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { resumesApi } from '../api/resumes.api.js';
import ResumePreviewDocument from '../components/resume/ResumePreviewDocument.jsx';
import AIBulletCopilotModal from '../components/resume/AIBulletCopilotModal.jsx';

export default function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resumes, isLoading: resumesLoading } = useResumes();

  const [selectedResumeId, setSelectedResumeId] = useState(searchParams.get('resumeId') || '');
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Resume State
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [resumeContent, setResumeContent] = useState({
    personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  // Customization State
  const [template, setTemplate] = useState('modern');
  const [accentColor, setAccentColor] = useState('#4F46E5');
  const [zoomScale, setZoomScale] = useState(0.85);

  // Active section accordion state
  const [activeSection, setActiveSection] = useState('personalInfo');

  // AI Bullet Copilot Modal state
  const [copilotModalOpen, setCopilotModalOpen] = useState(false);
  const [activeBulletTarget, setActiveBulletTarget] = useState(null); // { section: 'experience'|'projects', itemIdx, bulletIdx, text }

  // New Skill input tag
  const [skillInput, setSkillInput] = useState('');

  // Available templates & accent colors
  const templates = [
    { id: 'modern', label: 'Modern Tech', desc: 'Clean header & skill badges' },
    { id: 'classic', label: 'Classic Harvard', desc: 'Serif fonts & center alignment' },
    { id: 'minimalist', label: 'Minimalist', desc: 'Refined whitespace & sleek text' },
    { id: 'executive', label: 'Executive', desc: 'Bold leadership & strong borders' }
  ];

  const accentColors = [
    { id: '#4F46E5', name: 'Indigo' },
    { id: '#059669', name: 'Emerald' },
    { id: '#0284C7', name: 'Sky Blue' },
    { id: '#D97706', name: 'Amber' },
    { id: '#E11D48', name: 'Rose' },
    { id: '#7C3AED', name: 'Violet' },
    { id: '#1E293B', name: 'Slate Dark' }
  ];

  // Auto-select initial resume
  useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [resumes, selectedResumeId]);

  // Load resume data on select
  useEffect(() => {
    if (!selectedResumeId) return;

    const loadResume = async () => {
      setIsLoadingResume(true);
      try {
        const { data } = await resumesApi.getById(selectedResumeId);
        const res = data.data;
        setResumeTitle(res.title || 'My Resume');
        setResumeContent(res.content || {
          personalInfo: {},
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: []
        });
      } catch (err) {
        toast.error('Failed to load resume details.');
      } finally {
        setIsLoadingResume(false);
      }
    };

    loadResume();
  }, [selectedResumeId]);

  // Form Change Handlers
  const handlePersonalInfoChange = (field, value) => {
    setResumeContent((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setResumeContent((prev) => ({
      ...prev,
      experience: [
        {
          role: 'Software Engineer',
          company: 'Tech Company',
          location: 'San Francisco, CA',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          isCurrent: true,
          bulletPoints: ['Architected core backend services using Node.js, improving throughput by 30%.']
        },
        ...(prev.experience || [])
      ]
    }));
  };

  const handleUpdateExperience = (idx, field, value) => {
    setResumeContent((prev) => {
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], [field]: value };
      return { ...prev, experience: exp };
    });
  };

  const handleRemoveExperience = (idx) => {
    setResumeContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  const handleAddExperienceBullet = (expIdx) => {
    setResumeContent((prev) => {
      const exp = [...prev.experience];
      exp[expIdx] = {
        ...exp[expIdx],
        bulletPoints: [...(exp[expIdx].bulletPoints || []), 'Engineered scalable features delivering high user engagement.']
      };
      return { ...prev, experience: exp };
    });
  };

  const handleUpdateExperienceBullet = (expIdx, bulletIdx, text) => {
    setResumeContent((prev) => {
      const exp = [...prev.experience];
      const bullets = [...(exp[expIdx].bulletPoints || [])];
      bullets[bulletIdx] = text;
      exp[expIdx] = { ...exp[expIdx], bulletPoints: bullets };
      return { ...prev, experience: exp };
    });
  };

  const handleRemoveExperienceBullet = (expIdx, bulletIdx) => {
    setResumeContent((prev) => {
      const exp = [...prev.experience];
      exp[expIdx] = {
        ...exp[expIdx],
        bulletPoints: exp[expIdx].bulletPoints.filter((_, i) => i !== bulletIdx)
      };
      return { ...prev, experience: exp };
    });
  };

  // Projects Handlers
  const handleAddProject = () => {
    setResumeContent((prev) => ({
      ...prev,
      projects: [
        {
          name: 'AI Analytics Platform',
          technologies: ['React', 'Node.js', 'MongoDB'],
          description: 'Full-stack application delivering real-time metric visualizations.',
          link: 'https://github.com/example/project',
          bulletPoints: ['Engineered responsive React interface handling 500+ daily mock requests.']
        },
        ...(prev.projects || [])
      ]
    }));
  };

  const handleUpdateProject = (idx, field, value) => {
    setResumeContent((prev) => {
      const projs = [...prev.projects];
      projs[idx] = { ...projs[idx], [field]: value };
      return { ...prev, projects: projs };
    });
  };

  const handleRemoveProject = (idx) => {
    setResumeContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  // Education Handlers
  const handleAddEducation = () => {
    setResumeContent((prev) => ({
      ...prev,
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          endYear: '2024',
          gpa: '3.8'
        },
        ...(prev.education || [])
      ]
    }));
  };

  const handleUpdateEducation = (idx, field, value) => {
    setResumeContent((prev) => {
      const edu = [...prev.education];
      edu[idx] = { ...edu[idx], [field]: value };
      return { ...prev, education: edu };
    });
  };

  const handleRemoveEducation = (idx) => {
    setResumeContent((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };

  // Skills Handlers
  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!resumeContent.skills?.includes(skillInput.trim())) {
        setResumeContent((prev) => ({
          ...prev,
          skills: [...(prev.skills || []), skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setResumeContent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // Open Copilot Modal
  const openBulletCopilot = (section, itemIdx, bulletIdx, text) => {
    setActiveBulletTarget({ section, itemIdx, bulletIdx, text });
    setCopilotModalOpen(true);
  };

  // Apply AI Copilot Rewrite
  const handleApplyCopilotBullet = (newText) => {
    if (!activeBulletTarget) return;
    const { section, itemIdx, bulletIdx } = activeBulletTarget;
    if (section === 'experience') {
      handleUpdateExperienceBullet(itemIdx, bulletIdx, newText);
    } else if (section === 'projects') {
      setResumeContent((prev) => {
        const projs = [...prev.projects];
        const bullets = [...(projs[itemIdx].bulletPoints || [])];
        bullets[bulletIdx] = newText;
        projs[itemIdx] = { ...projs[itemIdx], bulletPoints: bullets };
        return { ...prev, projects: projs };
      });
    }
  };

  // Save to Database
  const handleSaveResume = async () => {
    if (!selectedResumeId) {
      toast.error('No resume selected.');
      return;
    }
    setIsSaving(true);
    try {
      await resumesApi.update(selectedResumeId, {
        title: resumeTitle,
        content: resumeContent
      });
      toast.success('Resume saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    if (!selectedResumeId) {
      toast.error('No resume selected.');
      return;
    }
    setIsDownloading(true);
    try {
      const response = await resumesApi.downloadPdf(selectedResumeId, {
        template,
        accentColor
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resumeTitle.replace(/[^\w\- ]+/g, '') || 'Resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.error('Failed to generate PDF download.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (resumesLoading) {
    return <PageLoader label="Loading resume builder" />;
  }

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in">
      {/* Top Toolbar */}
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 dark:bg-dark-900/90 backdrop-blur-md border border-dark-100 dark:border-dark-800 shadow-sm">
        {/* Left: Resume Title & Selector */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="text-base font-bold font-display text-dark-900 dark:text-white bg-transparent border-b border-transparent hover:border-dark-200 focus:border-primary-500 focus:outline-none"
              placeholder="Resume Title"
            />
            {resumes.length > 1 && (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="block text-[11px] font-mono text-dark-400 bg-transparent focus:outline-none cursor-pointer mt-0.5"
              >
                {resumes.map((r) => (
                  <option key={r._id} value={r._id} className="text-dark-900 dark:text-white dark:bg-dark-900">
                    Switch: {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Center: Template & Accent Color Controls */}
        <div className="flex items-center gap-3">
          {/* Template Dropdown */}
          <div className="flex items-center gap-1.5 p-1 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-100 dark:border-dark-700">
            <Layout className="w-3.5 h-3.5 text-dark-400 ml-2" />
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="text-xs font-semibold bg-transparent text-dark-800 dark:text-white pr-2 py-1 focus:outline-none cursor-pointer"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id} className="text-dark-900 dark:text-white dark:bg-dark-900">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker Swatches */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-100 dark:border-dark-700">
            {accentColors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setAccentColor(color.id)}
                title={color.name}
                className={`w-5 h-5 rounded-full transition-transform ${
                  accentColor === color.id ? 'scale-125 ring-2 ring-primary-500 ring-offset-1' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color.id }}
              />
            ))}
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-dark-50 dark:bg-dark-800 rounded-xl border border-dark-100 dark:border-dark-700 text-dark-600 dark:text-dark-400">
            <button
              onClick={() => setZoomScale((s) => Math.max(0.5, s - 0.1))}
              className="p-1.5 hover:text-dark-900 dark:hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1 font-semibold">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale((s) => Math.min(1.3, s + 0.1))}
              className="p-1.5 hover:text-dark-900 dark:hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Save & Download Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveResume}
            isLoading={isSaving}
            className="text-xs font-bold"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </Button>

          <Button
            variant="lime"
            size="sm"
            onClick={handleDownloadPdf}
            isLoading={isDownloading}
            className="text-xs font-bold shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-ink" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ================= LEFT PANE: ACCORDION FORM EDITOR ================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* Section 1: Personal Info */}
          <Card className="overflow-hidden border-dark-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === 'personalInfo' ? '' : 'personalInfo')}
              className="w-full flex items-center justify-between p-4 bg-dark-50/50 dark:bg-dark-900/50 text-left hover:bg-dark-50 dark:hover:bg-dark-900 transition-colors"
            >
              <div className="flex items-center gap-2.5 font-bold text-sm text-dark-900 dark:text-white">
                <FileText className="w-4 h-4 text-primary-600" />
                <span>Personal & Contact Info</span>
              </div>
              {activeSection === 'personalInfo' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeSection === 'personalInfo' && (
              <div className="p-5 space-y-4 border-t border-dark-100 dark:border-dark-800 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo?.name || ''}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      placeholder="Alex Doe"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeContent.personalInfo?.email || ''}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo?.phone || ''}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo?.location || ''}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo?.linkedin || ''}
                      onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/alex"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">Portfolio / Website</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo?.portfolio || ''}
                      onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                      placeholder="alexdoe.dev"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1">Professional Summary</label>
                  <textarea
                    rows={3}
                    value={resumeContent.personalInfo?.summary || ''}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    placeholder="2-4 lines summarizing role, top skills, and standout quantified achievement..."
                    className="w-full p-3 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-sans resize-none"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Section 2: Work Experience */}
          <Card className="overflow-hidden border-dark-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === 'experience' ? '' : 'experience')}
              className="w-full flex items-center justify-between p-4 bg-dark-50/50 dark:bg-dark-900/50 text-left hover:bg-dark-50 dark:hover:bg-dark-900 transition-colors"
            >
              <div className="flex items-center gap-2.5 font-bold text-sm text-dark-900 dark:text-white">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Work Experience ({resumeContent.experience?.length || 0})</span>
              </div>
              {activeSection === 'experience' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeSection === 'experience' && (
              <div className="p-5 space-y-6 border-t border-dark-100 dark:border-dark-800 animate-fade-in">
                {resumeContent.experience?.map((job, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-dark-50/50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 space-y-3 relative group"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-danger-500 hover:bg-danger-50 transition-colors"
                      title="Remove Role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Job Title / Role</label>
                        <input
                          type="text"
                          value={job.role || ''}
                          onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Company Name</label>
                        <input
                          type="text"
                          value={job.company || ''}
                          onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Bullet Points with Inline Copilot */}
                    <div className="space-y-2 pt-2 border-t border-dark-100 dark:border-dark-800">
                      <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">
                        Achievement Bullets
                      </label>

                      {job.bulletPoints?.map((bullet, bidx) => (
                        <div key={bidx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleUpdateExperienceBullet(idx, bidx, e.target.value)}
                            className="flex-1 p-2 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white resize-none"
                          />
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => openBulletCopilot('experience', idx, bidx, bullet)}
                              className="px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-300 hover:bg-primary-100 text-[10px] font-bold flex items-center gap-1 shadow-2xs whitespace-nowrap"
                              title="Improve with AI"
                            >
                              <Sparkles className="w-3 h-3 text-accent-500" />
                              <span>AI Copilot</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperienceBullet(idx, bidx)}
                              className="p-1 rounded text-dark-400 hover:text-danger-500 hover:bg-danger-50 text-center"
                              title="Delete Bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddExperienceBullet(idx)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddExperience}
                  className="w-full justify-center text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Work Experience</span>
                </Button>
              </div>
            )}
          </Card>

          {/* Section 3: Projects */}
          <Card className="overflow-hidden border-dark-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === 'projects' ? '' : 'projects')}
              className="w-full flex items-center justify-between p-4 bg-dark-50/50 dark:bg-dark-900/50 text-left hover:bg-dark-50 dark:hover:bg-dark-900 transition-colors"
            >
              <div className="flex items-center gap-2.5 font-bold text-sm text-dark-900 dark:text-white">
                <FolderGit2 className="w-4 h-4 text-accent-600" />
                <span>Projects ({resumeContent.projects?.length || 0})</span>
              </div>
              {activeSection === 'projects' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeSection === 'projects' && (
              <div className="p-5 space-y-6 border-t border-dark-100 dark:border-dark-800 animate-fade-in">
                {resumeContent.projects?.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-dark-50/50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-danger-500 hover:bg-danger-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Project Name</label>
                        <input
                          type="text"
                          value={proj.name || ''}
                          onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Project URL / Link</label>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Technologies (comma separated)</label>
                      <input
                        type="text"
                        value={proj.technologies?.join(', ') || ''}
                        onChange={(e) =>
                          handleUpdateProject(
                            idx,
                            'technologies',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        placeholder="React, Node.js, Redis, Tailwind"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddProject}
                  className="w-full justify-center text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Project</span>
                </Button>
              </div>
            )}
          </Card>

          {/* Section 4: Skills */}
          <Card className="overflow-hidden border-dark-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === 'skills' ? '' : 'skills')}
              className="w-full flex items-center justify-between p-4 bg-dark-50/50 dark:bg-dark-900/50 text-left hover:bg-dark-50 dark:hover:bg-dark-900 transition-colors"
            >
              <div className="flex items-center gap-2.5 font-bold text-sm text-dark-900 dark:text-white">
                <Wrench className="w-4 h-4 text-sky-600" />
                <span>Technical Skills ({resumeContent.skills?.length || 0})</span>
              </div>
              {activeSection === 'skills' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeSection === 'skills' && (
              <div className="p-5 space-y-4 border-t border-dark-100 dark:border-dark-800 animate-fade-in">
                <div>
                  <label className="block text-xs font-bold uppercase text-dark-600 dark:text-dark-400 mb-1.5">
                    Type a skill and press Enter
                  </label>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="e.g. TypeScript, GraphQL, Docker, Next.js"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-950 text-dark-900 dark:text-white focus:ring-2 focus:ring-primary-500 font-medium"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {resumeContent.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-white border border-dark-200 dark:border-dark-700"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-dark-400 hover:text-danger-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Section 5: Education */}
          <Card className="overflow-hidden border-dark-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => setActiveSection(activeSection === 'education' ? '' : 'education')}
              className="w-full flex items-center justify-between p-4 bg-dark-50/50 dark:bg-dark-900/50 text-left hover:bg-dark-50 dark:hover:bg-dark-900 transition-colors"
            >
              <div className="flex items-center gap-2.5 font-bold text-sm text-dark-900 dark:text-white">
                <GraduationCap className="w-4 h-4 text-violet-600" />
                <span>Education ({resumeContent.education?.length || 0})</span>
              </div>
              {activeSection === 'education' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {activeSection === 'education' && (
              <div className="p-5 space-y-6 border-t border-dark-100 dark:border-dark-800 animate-fade-in">
                {resumeContent.education?.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-dark-50/50 dark:bg-dark-950 border border-dark-100 dark:border-dark-800 space-y-3 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-3 right-3 p-1 rounded-lg text-danger-500 hover:bg-danger-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => handleUpdateEducation(idx, 'field', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-dark-500">Graduation Year</label>
                        <input
                          type="text"
                          value={edu.endYear || ''}
                          onChange={(e) => handleUpdateEducation(idx, 'endYear', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-dark-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddEducation}
                  className="w-full justify-center text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Education Degree</span>
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* ================= RIGHT PANE: LIVE REAL-TIME WYSIWYG PREVIEW ================= */}
        <div className="lg:col-span-6 sticky top-24">
          <div className="p-4 rounded-2xl bg-dark-100 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 shadow-inner overflow-hidden flex flex-col items-center justify-start min-h-[750px]">
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-dark-200 dark:border-dark-800 text-xs text-dark-500">
              <span className="font-mono uppercase font-bold tracking-wider">Live Document Canvas</span>
              <span className="font-mono">Template: {template} | {accentColor}</span>
            </div>

            <div className="w-full overflow-x-auto flex justify-center py-2">
              <ResumePreviewDocument
                resumeContent={resumeContent}
                template={template}
                accentColor={accentColor}
                scale={zoomScale}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Bullet Point Copilot Modal */}
      <AIBulletCopilotModal
        isOpen={copilotModalOpen}
        onClose={() => setCopilotModalOpen(false)}
        initialBulletText={activeBulletTarget?.text || ''}
        targetRole="Senior Software Engineer"
        onApplyBullet={handleApplyCopilotBullet}
      />
    </div>
  );
}
