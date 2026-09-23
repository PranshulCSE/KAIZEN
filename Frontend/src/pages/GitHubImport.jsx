import React, { useState } from 'react';
import {
  Github,
  Search,
  Sparkles,
  Star,
  GitFork,
  CheckCircle2,
  ExternalLink,
  Code2,
  Plus,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import { PageLoader } from '../components/ui/Spinner.jsx';
import { useResumes } from '../hooks/useResumes.js';
import { aiApi } from '../api/ai.api.js';
import { resumesApi } from '../api/resumes.api.js';

export default function GitHubImport() {
  const { resumes } = useResumes();

  const [username, setUsername] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [selectedResumeId, setSelectedResumeId] = useState('');

  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepoNames, setSelectedRepoNames] = useState(new Set());

  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [isAppending, setIsAppending] = useState(false);

  // Set default resume
  React.useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [resumes, selectedResumeId]);

  const handleFetchGitHub = async (e) => {
    e?.preventDefault();
    if (!username.trim()) {
      toast.error('Please enter a GitHub username');
      return;
    }

    setIsFetchingRepos(true);
    setProfileData(null);
    setRepositories([]);
    setSelectedRepoNames(new Set());
    setGeneratedProjects([]);

    try {
      const { data } = await aiApi.getGitHubRepos({ username: username.trim() });
      setProfileData(data.data.profile);
      setRepositories(data.data.repositories || []);
      // Automatically select top 3 repos with highest stars
      const top3 = new Set((data.data.repositories || []).slice(0, 3).map((r) => r.name));
      setSelectedRepoNames(top3);
      toast.success(`Found ${data.data.repositories?.length || 0} repositories!`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to fetch GitHub profile');
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const toggleRepoSelection = (repoName) => {
    setSelectedRepoNames((prev) => {
      const next = new Set(prev);
      if (next.has(repoName)) {
        next.delete(repoName);
      } else {
        if (next.size >= 5) {
          toast.error('You can select up to 5 repositories at a time.');
          return prev;
        }
        next.add(repoName);
      }
      return next;
    });
  };

  const handleGenerateBullets = async () => {
    if (selectedRepoNames.size === 0) {
      toast.error('Please select at least 1 repository to convert.');
      return;
    }

    const selectedReposList = repositories.filter((r) => selectedRepoNames.has(r.name));

    setIsGeneratingBullets(true);
    try {
      const { data } = await aiApi.generateGitHubBullets({
        repositories: selectedReposList,
        targetRole
      });

      setGeneratedProjects(data.data.projects || []);
      toast.success('Generated ATS-ready project entries!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to generate project bullets');
    } finally {
      setIsGeneratingBullets(false);
    }
  };

  const handleAppendToResume = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a target resume.');
      return;
    }
    if (generatedProjects.length === 0) {
      toast.error('No generated projects to add.');
      return;
    }

    setIsAppending(true);
    try {
      // 1. Fetch current resume content
      const { data: resumeData } = await resumesApi.getById(selectedResumeId);
      const resume = resumeData.data;

      // 2. Format new project items
      const newProjects = generatedProjects.map((p) => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies || [],
        link: p.link || '',
        github: p.link || '',
        bulletPoints: p.bulletPoints || []
      }));

      // 3. Append to existing projects
      const existingProjects = resume.content?.projects || [];
      const updatedProjects = [...existingProjects, ...newProjects];

      // 4. Save updated resume
      await resumesApi.update(selectedResumeId, {
        content: {
          ...resume.content,
          projects: updatedProjects
        }
      });

      toast.success(`Added ${newProjects.length} projects to "${resume.title}"!`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update resume');
    } finally {
      setIsAppending(false);
    }
  };

  const copyProjectText = (project, idx) => {
    const text = `**${project.name}** | ${project.technologies?.join(', ')}\n${project.description}\n${project.bulletPoints?.map((b) => `• ${b}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success('Project text copied!');
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  return (
    <div className="flex flex-col gap-8 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-900 via-[#181B20] to-dark-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold tracking-wide text-primary-200 mb-3">
              <Github className="w-3.5 h-3.5 text-white" />
              <span>GitHub to Resume Synchronizer</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
              GitHub Portfolio Auto-Importer
            </h1>
            <p className="mt-2 text-sm sm:text-base text-dark-300 leading-relaxed">
              Import your public GitHub repositories and let AI transform commit history, tech stack, and stars into quantified, ATS-compliant project bullet points.
            </p>
          </div>

          {/* Quick Search Box */}
          <form onSubmit={handleFetchGitHub} className="flex items-center gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-xs font-mono">
                github.com/
              </span>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-28 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-dark-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
              />
            </div>
            <Button
              type="submit"
              variant="lime"
              size="md"
              isLoading={isFetchingRepos}
              className="font-bold shadow-md"
            >
              <Search className="w-4 h-4 text-ink" />
              <span>Fetch</span>
            </Button>
          </form>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Content Area */}
      {!profileData ? (
        <div className="rounded-2xl border-2 border-dashed border-dark-200 bg-white p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-dark-50 text-dark-800 flex items-center justify-center mx-auto mb-4 border border-dark-100">
            <Github className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold font-display text-dark-900 mb-1">
            Connect Any Public GitHub Account
          </h3>
          <p className="text-xs text-dark-500 max-w-md mx-auto leading-relaxed mb-6">
            Enter your GitHub username above to discover your top repositories, analyze dependencies, and generate high-impact resume project entries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-dark-500">
            <span>Popular examples:</span>
            {['shadcn', 'octocat', 'torvalds'].map((demo) => (
              <button
                key={demo}
                type="button"
                onClick={() => {
                  setUsername(demo);
                }}
                className="px-2.5 py-1 rounded-lg bg-dark-50 hover:bg-primary-50 hover:text-primary-600 border border-dark-100 font-mono transition-colors"
              >
                @{demo}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: User Profile & Repo Selection */}
          <div className="lg:col-span-6 space-y-6">
            {/* User Profile Card */}
            <div className="p-5 rounded-2xl bg-white border border-dark-100 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={profileData.avatarUrl}
                  alt={profileData.username}
                  className="w-14 h-14 rounded-2xl border border-dark-100 shadow-sm object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-dark-900">{profileData.name}</h3>
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-dark-400 hover:text-primary-600"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-xs font-mono text-dark-500">@{profileData.username}</p>
                  {profileData.bio && (
                    <p className="text-xs text-dark-600 mt-1 line-clamp-1">{profileData.bio}</p>
                  )}
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                  {repositories.length} Repositories
                </span>
              </div>
            </div>

            {/* Target Role & Selection Controls */}
            <Card className="p-5 border-dark-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-dark-100">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-dark-700">
                  Select Repositories to Convert ({selectedRepoNames.size} selected)
                </h4>
                <span className="text-[11px] font-mono text-dark-400">Max 5 repos</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-700 mb-1.5">
                  Target Role Rubric
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-dark-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                />
              </div>

              {/* Repositories Checklist */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {repositories.map((repo) => {
                  const isChecked = selectedRepoNames.has(repo.name);
                  return (
                    <div
                      key={repo.name}
                      onClick={() => toggleRepoSelection(repo.name)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-primary-500 bg-primary-50/50 shadow-2xs'
                          : 'border-dark-100 bg-white hover:border-dark-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent div
                            className="mt-1 h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-dark-900 font-mono">
                                {repo.name}
                              </span>
                              {repo.stars > 0 && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  {repo.stars}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-dark-500 line-clamp-2 mt-1">
                              {repo.description}
                            </p>
                          </div>
                        </div>

                        {repo.language && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-100 text-dark-700 whitespace-nowrap">
                            {repo.language}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Convert Button */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerateBullets}
                isLoading={isGeneratingBullets}
                className="w-full justify-center font-bold text-sm shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Transform {selectedRepoNames.size} Repos into Resume Bullets</span>
              </Button>
            </Card>
          </div>

          {/* RIGHT: Generated Project Entries */}
          <div className="lg:col-span-6 space-y-6">
            {generatedProjects.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-dark-200 bg-white p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
                  <Code2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold font-display text-dark-900 mb-1">
                  Ready to Generate
                </h3>
                <p className="text-xs text-dark-500 max-w-sm mx-auto leading-relaxed">
                  Select repositories on the left and click Transform to generate quantified, ATS-optimized project bullets with tech stack tags.
                </p>
              </div>
            ) : (
              <div className="space-y-5 animate-scale-in">
                {/* Action Bar */}
                <div className="p-4 rounded-2xl bg-white border border-dark-100 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-dark-700">
                      Generated {generatedProjects.length} Projects
                    </span>
                    <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ATS Optimized
                    </span>
                  </div>

                  {/* Add directly to resume bar */}
                  {resumes.length > 0 && (
                    <div className="pt-2 border-t border-dark-100 flex flex-wrap items-center gap-2">
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-dark-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                      >
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id}>
                            Add to: {r.title}
                          </option>
                        ))}
                      </select>

                      <Button
                        variant="lime"
                        size="sm"
                        onClick={handleAppendToResume}
                        isLoading={isAppending}
                        className="text-xs font-bold shadow-sm whitespace-nowrap"
                      >
                        <Plus className="w-3.5 h-3.5 text-ink" />
                        <span>Insert into Resume</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Project Cards */}
                {generatedProjects.map((project, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-dark-100 shadow-sm space-y-3 hover:border-primary-200 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-dark-900 font-display">
                          {project.name}
                        </h4>
                        <p className="text-xs text-dark-500 mt-0.5">{project.description}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyProjectText(project, idx)}
                        className="text-xs"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Tech Badges */}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((t, tidx) => (
                          <span
                            key={tidx}
                            className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-dark-50 text-dark-700 border border-dark-100"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bullet Points */}
                    <div className="p-3.5 rounded-xl bg-dark-50/70 border border-dark-100 space-y-2">
                      {project.bulletPoints?.map((bullet, bidx) => (
                        <div key={bidx} className="flex items-start gap-2 text-xs text-dark-800 leading-relaxed">
                          <span className="text-primary-600 font-bold">•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
