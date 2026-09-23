const React = require('react');
const { Document, Page, Text, View, StyleSheet, pdf } = require('@react-pdf/renderer');

// Helper to construct rock-solid ATS stylesheet based on selected template
const createResumeStyles = (template = 'modern', accentColor = '#2563EB') => {
  const isClassic = template === 'classic';

  const fontFamily = isClassic ? 'Times-Roman' : 'Helvetica';
  const fontBold = isClassic ? 'Times-Bold' : 'Helvetica-Bold';
  const fontItalic = isClassic ? 'Times-Italic' : 'Helvetica-Oblique';
  const themeAccent = isClassic ? '#1E293B' : (accentColor || '#2563EB');

  return StyleSheet.create({
    page: {
      paddingTop: 28,
      paddingBottom: 28,
      paddingHorizontal: 32,
      fontFamily,
      fontSize: 9.5,
      lineHeight: 1.35,
      color: '#0F172A',
    },
    // Header
    header: {
      marginBottom: 10,
      borderBottomWidth: 1.5,
      borderBottomColor: themeAccent,
      paddingBottom: 8,
      textAlign: isClassic ? 'center' : 'left',
    },
    name: {
      fontSize: isClassic ? 20 : 19,
      fontFamily: fontBold,
      marginBottom: 3,
      color: isClassic ? '#0F172A' : themeAccent,
      textTransform: isClassic ? 'uppercase' : 'none',
      letterSpacing: isClassic ? 0.8 : 0,
    },
    contactContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: isClassic ? 'center' : 'flex-start',
      alignItems: 'center',
      gap: 6,
      marginTop: 2,
    },
    contactItem: {
      fontSize: 8.5,
      color: '#475569',
    },
    contactDivider: {
      fontSize: 8,
      color: '#94A3B8',
      marginHorizontal: 3,
    },
    // Section Heading
    sectionTitle: {
      fontSize: 10.5,
      fontFamily: fontBold,
      marginTop: 9,
      marginBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: isClassic ? '#94A3B8' : '#CBD5E1',
      paddingBottom: 2,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      color: isClassic ? '#1E293B' : themeAccent,
    },
    summaryText: {
      fontSize: 9,
      lineHeight: 1.4,
      color: '#334155',
      marginBottom: 4,
      textAlign: 'justify',
    },
    // Entry items (Experience, Projects, Education)
    entryContainer: {
      marginBottom: 6,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 1.5,
    },
    entryTitle: {
      fontSize: 9.5,
      fontFamily: fontBold,
      color: '#0F172A',
    },
    entryDate: {
      fontSize: 8.5,
      color: '#64748B',
      fontFamily: isClassic ? fontItalic : fontFamily,
    },
    entrySubtitle: {
      fontSize: 8.5,
      color: '#475569',
      fontFamily: fontItalic,
      marginBottom: 2,
    },
    // Bullet Points
    bulletRow: {
      flexDirection: 'row',
      marginBottom: 2.5,
      paddingLeft: 2,
    },
    bulletChar: {
      width: 10,
      fontSize: 9,
      color: themeAccent,
      lineHeight: 1.3,
    },
    bulletContent: {
      flex: 1,
      fontSize: 8.5,
      color: '#334155',
      lineHeight: 1.35,
    },
    // Skills
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 3,
      marginBottom: 4,
    },
    skillPill: {
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      marginRight: 3,
      marginBottom: 3,
      backgroundColor: isClassic ? 'transparent' : '#F1F5F9',
      borderRadius: 2,
      borderWidth: isClassic ? 0.5 : 0,
      borderColor: '#CBD5E1',
      fontSize: 8,
      color: '#1E293B',
      fontFamily: isClassic ? fontFamily : fontBold,
    },
  });
};

const generateResumePDFBuffer = async (resume, optimization, options = {}) => {
  try {
    // If directOptimizedContent was passed in optimization object, use it directly!
    const effectiveContent = optimization?.directOptimizedContent || resume.content || {};
    const { template = 'modern', accentColor = '#2563EB' } = options || {};
    const styles = createResumeStyles(template, accentColor);
    const h = React.createElement;

    // Apply summary & bullet rewrites if directOptimizedContent wasn't present
    let displaySummary = effectiveContent.personalInfo?.summary || '';
    const beforeAfterMap = {};

    if (optimization?.beforeAfter && Array.isArray(optimization.beforeAfter)) {
      optimization.beforeAfter.forEach(({ before, after }) => {
        if (before && after) {
          beforeAfterMap[before] = after;
        }
      });
    }

    if (optimization?.summaryRewrite && !effectiveContent.personalInfo?.summary) {
      displaySummary = optimization.summaryRewrite;
    }

    const formatDate = (d) => {
      if (!d) return '';
      const date = new Date(d);
      return isNaN(date) ? String(d) : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const cleanLink = (url) => {
      if (!url) return '';
      return String(url).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
    };

    // Build PDF Document with React.createElement
    const doc = h(
      Document,
      null,
      h(
        Page,
        { size: 'A4', style: styles.page },
        // HEADER
        h(
          View,
          { style: styles.header },
          h(Text, { style: styles.name }, effectiveContent.personalInfo?.name || 'Candidate Name'),
          h(
            View,
            { style: styles.contactContainer },
            effectiveContent.personalInfo?.email
              ? h(Text, { style: styles.contactItem }, effectiveContent.personalInfo.email)
              : null,
            effectiveContent.personalInfo?.phone
              ? h(React.Fragment, null, h(Text, { style: styles.contactDivider }, '•'), h(Text, { style: styles.contactItem }, effectiveContent.personalInfo.phone))
              : null,
            effectiveContent.personalInfo?.location
              ? h(React.Fragment, null, h(Text, { style: styles.contactDivider }, '•'), h(Text, { style: styles.contactItem }, effectiveContent.personalInfo.location))
              : null,
            effectiveContent.personalInfo?.linkedin
              ? h(React.Fragment, null, h(Text, { style: styles.contactDivider }, '•'), h(Text, { style: styles.contactItem }, cleanLink(effectiveContent.personalInfo.linkedin)))
              : null,
            effectiveContent.personalInfo?.portfolio
              ? h(React.Fragment, null, h(Text, { style: styles.contactDivider }, '•'), h(Text, { style: styles.contactItem }, cleanLink(effectiveContent.personalInfo.portfolio)))
              : null
          )
        ),

        // SUMMARY SECTION
        displaySummary
          ? h(
              View,
              { wrap: false },
              h(Text, { style: styles.sectionTitle }, 'Professional Summary'),
              h(Text, { style: styles.summaryText }, displaySummary)
            )
          : null,

        // WORK EXPERIENCE
        effectiveContent.experience && effectiveContent.experience.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Work Experience'),
              ...effectiveContent.experience.map((job, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer, wrap: false },
                  h(
                    View,
                    { style: styles.entryHeader },
                    h(Text, { style: styles.entryTitle }, job.role || 'Software Engineer'),
                    h(
                      Text,
                      { style: styles.entryDate },
                      `${formatDate(job.startDate)} – ${job.isCurrent ? 'Present' : formatDate(job.endDate)}`
                    )
                  ),
                  job.company
                    ? h(Text, { style: styles.entrySubtitle }, `${job.company}${job.location ? ` | ${job.location}` : ''}`)
                    : null,
                  // Bullet Points
                  job.bulletPoints && job.bulletPoints.length > 0
                    ? h(
                        View,
                        null,
                        ...job.bulletPoints.map((bp, bidx) => {
                          if (!bp) return null;
                          const displayBp = beforeAfterMap[bp] || bp;
                          return h(
                            View,
                            { key: bidx, style: styles.bulletRow },
                            h(Text, { style: styles.bulletChar }, '•'),
                            h(Text, { style: styles.bulletContent }, displayBp)
                          );
                        })
                      )
                    : null
                )
              )
            )
          : null,

        // PROJECTS
        effectiveContent.projects && effectiveContent.projects.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Key Projects'),
              ...effectiveContent.projects.map((proj, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer, wrap: false },
                  h(
                    View,
                    { style: styles.entryHeader },
                    h(Text, { style: styles.entryTitle }, proj.name || 'Project Name'),
                    proj.link ? h(Text, { style: styles.entryDate }, cleanLink(proj.link)) : null
                  ),
                  proj.technologies && proj.technologies.length > 0
                    ? h(Text, { style: styles.entrySubtitle }, `Technologies: ${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}`)
                    : null,
                  proj.description ? h(Text, { style: styles.summaryText }, proj.description) : null,
                  proj.bulletPoints && proj.bulletPoints.length > 0
                    ? h(
                        View,
                        null,
                        ...proj.bulletPoints.map((bp, bidx) =>
                          h(
                            View,
                            { key: bidx, style: styles.bulletRow },
                            h(Text, { style: styles.bulletChar }, '•'),
                            h(Text, { style: styles.bulletContent }, bp)
                          )
                        )
                      )
                    : null
                )
              )
            )
          : null,

        // EDUCATION
        effectiveContent.education && effectiveContent.education.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Education'),
              ...effectiveContent.education.map((edu, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer, wrap: false },
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

        // TECHNICAL SKILLS
        effectiveContent.skills && effectiveContent.skills.length > 0
          ? h(
              View,
              { wrap: false },
              h(Text, { style: styles.sectionTitle }, 'Technical Skills'),
              h(
                View,
                { style: styles.skillsContainer },
                ...effectiveContent.skills.map((skill, idx) =>
                  skill ? h(Text, { key: idx, style: styles.skillPill }, skill) : null
                )
              )
            )
          : null,

        // CERTIFICATIONS
        effectiveContent.certifications && effectiveContent.certifications.length > 0
          ? h(
              View,
              { wrap: false },
              h(Text, { style: styles.sectionTitle }, 'Certifications'),
              ...effectiveContent.certifications.map((cert, idx) =>
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

    const buffer = await pdf(doc).toBuffer();
    return buffer;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = { generateResumePDFBuffer };