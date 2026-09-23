import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react';

export default function ResumePreviewDocument({
  resumeContent = {},
  template = 'modern',
  accentColor = '#4F46E5',
  scale = 1
}) {
  const {
    personalInfo = {},
    skills = [],
    experience = [],
    education = [],
    projects = [],
    certifications = [],
    languages = []
  } = resumeContent || {};

  const isClassic = template === 'classic';
  const isMinimalist = template === 'minimalist';
  const isExecutive = template === 'executive';

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return isNaN(date) ? String(d) : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div
      className="origin-top transition-transform duration-200"
      style={{ transform: `scale(${scale})` }}
    >
      <div
        className={`w-[210mm] min-h-[297mm] mx-auto bg-white p-10 text-slate-900 shadow-2xl border border-slate-200 transition-all ${
          isClassic ? 'font-serif' : 'font-sans'
        }`}
        style={{
          boxSizing: 'border-box'
        }}
      >
        {/* ================= HEADER ================= */}
        <header
          className={`pb-4 mb-5 border-b-2 ${
            isClassic ? 'text-center' : 'text-left'
          }`}
          style={{
            borderColor: isClassic ? '#1E293B' : accentColor || '#4F46E5'
          }}
        >
          <h1
            className={`font-black tracking-tight leading-none mb-2 ${
              isExecutive ? 'text-3xl' : 'text-2xl'
            } ${isClassic ? 'uppercase tracking-wider' : ''}`}
            style={{
              color: isExecutive ? accentColor : '#0F172A'
            }}
          >
            {personalInfo.name || 'Your Full Name'}
          </h1>

          {/* Contact Details */}
          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium ${
              isClassic ? 'justify-center' : 'justify-start'
            }`}
          >
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <span>•</span>
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <span>•</span>
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <span>•</span>
                <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </span>
            )}
            {personalInfo.portfolio && (
              <span className="flex items-center gap-1">
                <span>•</span>
                <span>{personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </span>
            )}
          </div>
        </header>

        {/* ================= PROFESSIONAL SUMMARY ================= */}
        {personalInfo.summary && (
          <section className="mb-5">
            <h2
              className={`text-xs font-bold uppercase tracking-wider mb-1.5 pb-1 border-b ${
                isClassic ? 'text-slate-800' : ''
              }`}
              style={{
                color: isClassic ? '#1E293B' : accentColor,
                borderColor: isClassic ? '#CBD5E1' : '#E2E8F0'
              }}
            >
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* ================= WORK EXPERIENCE ================= */}
        {experience && experience.length > 0 && (
          <section className="mb-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{
                color: isClassic ? '#1E293B' : accentColor,
                borderColor: isClassic ? '#CBD5E1' : '#E2E8F0'
              }}
            >
              Experience
            </h2>

            <div className="space-y-3.5">
              {experience.map((job, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xs font-bold text-slate-900">
                      {job.role || 'Job Title'}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDate(job.startDate)} – {job.isCurrent ? 'Present' : formatDate(job.endDate)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium italic">
                    {job.company}
                    {job.location ? ` | ${job.location}` : ''}
                  </div>

                  {/* Bullet Points */}
                  {job.bulletPoints && job.bulletPoints.length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {job.bulletPoints.map((bullet, bidx) => (
                        <li key={bidx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                          <span
                            className="font-bold text-sm leading-none mt-0.5"
                            style={{ color: accentColor }}
                          >
                            •
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= KEY PROJECTS ================= */}
        {projects && projects.length > 0 && (
          <section className="mb-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{
                color: isClassic ? '#1E293B' : accentColor,
                borderColor: isClassic ? '#CBD5E1' : '#E2E8F0'
              }}
            >
              Projects
            </h2>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xs font-bold text-slate-900">
                      {proj.name || 'Project Name'}
                    </h3>
                    {proj.link && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {proj.link.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-slate-600 font-mono font-medium">
                      <strong className="text-slate-700">Technologies:</strong> {proj.technologies.join(', ')}
                    </p>
                  )}

                  {proj.description && (
                    <p className="text-xs text-slate-700">{proj.description}</p>
                  )}

                  {proj.bulletPoints && proj.bulletPoints.length > 0 && (
                    <ul className="space-y-1 pt-0.5">
                      {proj.bulletPoints.map((bullet, bidx) => (
                        <li key={bidx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                          <span
                            className="font-bold text-sm leading-none mt-0.5"
                            style={{ color: accentColor }}
                          >
                            •
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= EDUCATION ================= */}
        {education && education.length > 0 && (
          <section className="mb-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{
                color: isClassic ? '#1E293B' : accentColor,
                borderColor: isClassic ? '#CBD5E1' : '#E2E8F0'
              }}
            >
              Education
            </h2>

            <div className="space-y-2.5">
              {education.map((edu, idx) => (
                <div key={idx} className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">
                      {edu.degree || 'Degree'}
                      {edu.field ? ` in ${edu.field}` : ''}
                    </h3>
                    <p className="text-xs text-slate-600 italic">
                      {edu.institution}
                      {edu.gpa ? ` — GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {edu.endYear ? `Graduated: ${edu.endYear}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= SKILLS ================= */}
        {skills && skills.length > 0 && (
          <section className="mb-5">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{
                color: isClassic ? '#1E293B' : accentColor,
                borderColor: isClassic ? '#CBD5E1' : '#E2E8F0'
              }}
            >
              Technical Skills
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    isMinimalist
                      ? 'border border-slate-200 text-slate-800'
                      : isExecutive
                      ? 'bg-slate-100 text-slate-900 border border-slate-200'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ================= CERTIFICATIONS ================= */}
        {certifications && certifications.length > 0 && (
          <section className="mb-4">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{
                color: isClassic ? '#1E293B' : accentColor,
                borderColor: isClassic ? '#CBD5E1' : '#E2E8F0'
              }}
            >
              Certifications
            </h2>

            <div className="space-y-1.5">
              {certifications.map((cert, idx) => (
                <div key={idx} className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    {cert.name}
                    {cert.issuer ? ` (${cert.issuer})` : ''}
                  </span>
                  {cert.date && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDate(cert.date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
