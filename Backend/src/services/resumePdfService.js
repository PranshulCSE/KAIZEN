const React = require('react');
const { Document, Page, Text, View, StyleSheet, pdf } = require('@react-pdf/renderer');

// Helper to construct stylesheet based on selected template & accent color
const createResumeStyles = (template = 'modern', accentColor = '#4F46E5') => {
  const isClassic = template === 'classic';
  const isMinimalist = template === 'minimalist';
  const isExecutive = template === 'executive';

  const fontFamily = isClassic ? 'Times-Roman' : 'Helvetica';
  const fontBold = isClassic ? 'Times-Bold' : 'Helvetica-Bold';
  const fontItalic = isClassic ? 'Times-Italic' : 'Helvetica-Oblique';

  return StyleSheet.create({
    page: {
      padding: isMinimalist ? 35 : 40,
      fontFamily,
      fontSize: 10,
      lineHeight: 1.4,
      color: '#1A1A1A',
    },
    header: {
      marginBottom: isClassic ? 14 : 16,
      borderBottomWidth: isMinimalist ? 1 : 2,
      borderBottomColor: isClassic ? '#1A1A1A' : accentColor || '#1A1A1A',
      paddingBottom: isClassic ? 8 : 10,
      textAlign: isClassic ? 'center' : 'left',
    },
    name: {
      fontSize: isExecutive ? 24 : 22,
      fontFamily: fontBold,
      marginBottom: 4,
      color: isExecutive ? accentColor : '#0F172A',
      letterSpacing: isMinimalist ? 0.5 : 0,
      textTransform: isClassic ? 'uppercase' : 'none',
    },
    contactContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: isClassic ? 'center' : 'flex-start',
      gap: 10,
      marginTop: 2,
    },
    contact: {
      fontSize: 9,
      color: '#475569',
      marginRight: 10,
    },
    sectionTitle: {
      fontSize: isMinimalist ? 11 : 12,
      fontFamily: fontBold,
      marginTop: 10,
      marginBottom: 6,
      borderBottomWidth: isMinimalist ? 0.5 : 1,
      borderBottomColor: isClassic ? '#CBD5E1' : isExecutive ? accentColor : '#E2E8F0',
      paddingBottom: 3,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: isClassic ? '#1E293B' : accentColor || '#1E293B',
    },
    summaryText: {
      fontSize: 9.5,
      lineHeight: 1.45,
      marginBottom: 8,
      color: '#334155',
    },
    entryContainer: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
    },
    entryTitle: {
      fontSize: 10.5,
      fontFamily: fontBold,
      color: '#0F172A',
    },
    entrySubtitle: {
      fontSize: 9.5,
      color: '#475569',
      fontFamily: fontItalic,
      marginBottom: 2,
    },
    entryDate: {
      fontSize: 9,
      color: '#64748B',
      fontFamily: isClassic ? fontItalic : fontFamily,
    },
    bulletPoint: {
      flexDirection: 'row',
      marginBottom: 3,
      paddingLeft: 4,
    },
    bullet: {
      width: 12,
      fontSize: 10,
      color: accentColor || '#475569',
    },
    bulletText: {
      flex: 1,
      fontSize: 9.5,
      color: '#334155',
      lineHeight: 1.4,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginBottom: 6,
    },
    skillBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginRight: 4,
      marginBottom: 4,
      backgroundColor: isMinimalist ? 'transparent' : isExecutive ? '#F8FAFC' : '#F1F5F9',
      borderRadius: 3,
      borderWidth: isMinimalist ? 0.5 : isExecutive ? 0.5 : 0,
      borderColor: '#CBD5E1',
      fontSize: 8.5,
      color: '#1E293B',
    },
  });
};

const generateResumePDFBuffer = async (resume, optimization, options = {}) => {
  try {
    const { content } = resume;
    const { template = 'modern', accentColor = '#4F46E5' } = options || {};
    const styles = createResumeStyles(template, accentColor);
    const h = React.createElement;

    // Apply AI optimization if provided
    let displaySummary = content.personalInfo?.summary || '';
    const beforeAfterMap = {};

    if (optimization?.beforeAfter && Array.isArray(optimization.beforeAfter)) {
      optimization.beforeAfter.forEach(({ before, after }) => {
        if (before && after) {
          beforeAfterMap[before] = after;
        }
      });
    }

    if (optimization?.summaryRewrite) {
      displaySummary = optimization.summaryRewrite;
    }

    const formatDate = (d) => {
      if (!d) return '';
      const date = new Date(d);
      return isNaN(date) ? String(d) : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Build PDF Document with React.createElement (CommonJS compatible)
    const doc = h(
      Document,
      null,
      h(
        Page,
        { size: 'A4', style: styles.page },
        // HEADER SECTION
        h(
          View,
          { style: styles.header },
          h(Text, { style: styles.name }, content.personalInfo?.name || 'Resume'),
          h(
            View,
            { style: styles.contactContainer },
            content.personalInfo?.email ? h(Text, { style: styles.contact }, content.personalInfo.email) : null,
            content.personalInfo?.phone ? h(Text, { style: styles.contact }, `•  ${content.personalInfo.phone}`) : null,
            content.personalInfo?.location ? h(Text, { style: styles.contact }, `•  ${content.personalInfo.location}`) : null,
            content.personalInfo?.linkedin ? h(Text, { style: styles.contact }, `•  ${content.personalInfo.linkedin}`) : null,
            content.personalInfo?.portfolio ? h(Text, { style: styles.contact }, `•  ${content.personalInfo.portfolio}`) : null
          )
        ),

        // SUMMARY SECTION
        displaySummary
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Professional Summary'),
              h(Text, { style: styles.summaryText }, displaySummary)
            )
          : null,

        // EXPERIENCE SECTION
        content.experience && content.experience.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Experience'),
              ...content.experience.map((job, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer },
                  h(
                    View,
                    { style: styles.entryHeader },
                    h(Text, { style: styles.entryTitle }, job.role || 'Role Title'),
                    h(
                      Text,
                      { style: styles.entryDate },
                      `${formatDate(job.startDate)} - ${job.isCurrent ? 'Present' : formatDate(job.endDate)}`
                    )
                  ),
                  job.company
                    ? h(Text, { style: styles.entrySubtitle }, `${job.company}${job.location ? ` | ${job.location}` : ''}`)
                    : null,
                  // Bullet Points (with AI Optimization rewrites applied)
                  job.bulletPoints && job.bulletPoints.length > 0
                    ? h(
                        View,
                        null,
                        ...job.bulletPoints.map((bp, bidx) => {
                          if (!bp) return null;
                          const displayBp = beforeAfterMap[bp] || bp;
                          return h(
                            View,
                            { key: bidx, style: styles.bulletPoint },
                            h(Text, { style: styles.bullet }, '•'),
                            h(Text, { style: styles.bulletText }, displayBp)
                          );
                        })
                      )
                    : null
                )
              )
            )
          : null,

        // EDUCATION SECTION
        content.education && content.education.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Education'),
              ...content.education.map((edu, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer },
                  h(
                    View,
                    { style: styles.entryHeader },
                    h(Text, { style: styles.entryTitle }, edu.degree || 'Degree'),
                    h(Text, { style: styles.entryDate }, edu.endYear ? `Graduated: ${edu.endYear}` : '')
                  ),
                  edu.institution
                    ? h(Text, { style: styles.entrySubtitle }, `${edu.institution}${edu.field ? ` — ${edu.field}` : ''}`)
                    : null,
                  edu.gpa ? h(Text, { style: styles.summaryText }, `GPA: ${edu.gpa}`) : null
                )
              )
            )
          : null,

        // PROJECTS SECTION
        content.projects && content.projects.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Key Projects'),
              ...content.projects.map((proj, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer },
                  h(
                    View,
                    { style: styles.entryHeader },
                    h(Text, { style: styles.entryTitle }, proj.name || 'Project Name'),
                    proj.link ? h(Text, { style: styles.entryDate }, proj.link) : null
                  ),
                  proj.technologies && proj.technologies.length > 0
                    ? h(Text, { style: styles.entrySubtitle }, `Technologies: ${proj.technologies.join(', ')}`)
                    : null,
                  proj.description ? h(Text, { style: styles.summaryText }, proj.description) : null,
                  proj.bulletPoints && proj.bulletPoints.length > 0
                    ? h(
                        View,
                        null,
                        ...proj.bulletPoints.map((bp, bidx) =>
                          h(
                            View,
                            { key: bidx, style: styles.bulletPoint },
                            h(Text, { style: styles.bullet }, '•'),
                            h(Text, { style: styles.bulletText }, bp)
                          )
                        )
                      )
                    : null
                )
              )
            )
          : null,

        // SKILLS SECTION
        content.skills && content.skills.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Technical Skills'),
              h(
                View,
                { style: styles.skillsContainer },
                ...content.skills.map((skill, idx) =>
                  skill ? h(Text, { key: idx, style: styles.skillBadge }, skill) : null
                )
              )
            )
          : null,

        // CERTIFICATIONS SECTION
        content.certifications && content.certifications.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Certifications'),
              ...content.certifications.map((cert, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer },
                  h(Text, { style: styles.entryTitle }, cert.name || 'Certification'),
                  cert.issuer ? h(Text, { style: styles.entrySubtitle }, `Issuer: ${cert.issuer}`) : null,
                  cert.date ? h(Text, { style: styles.entryDate }, `Date: ${formatDate(cert.date)}`) : null
                )
              )
            )
          : null
      )
    );

    // FIX Bug #1: Return Buffer directly (never stream)
    const buffer = await pdf(doc).toBuffer();
    return buffer;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = { generateResumePDFBuffer };