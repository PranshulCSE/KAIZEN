const React = require('react');
const { Document, Page, Text, View, StyleSheet, pdf } = require('@react-pdf/renderer');

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: '#000',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  contact: {
    fontSize: 10,
    color: '#333',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 4,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
    marginBottom: 10,
    color: '#222',
  },
  entryContainer: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#444',
    fontStyle: 'italic',
  },
  entryDate: {
    fontSize: 10,
    color: '#555',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 10,
  },
  bullet: {
    width: 15,
    fontSize: 11,
    color: '#000',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#222',
    lineHeight: 1.4,
  },
  skillBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    fontSize: 9,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
});

const generateResumePDFBuffer = async (resume, optimization) => {
  try {
    const { content } = resume;
    const h = React.createElement;

    // Apply optimization if provided
    let displaySummary = content.personalInfo?.summary || ''; // FIX: was content.personalSummary (doesn't exist on schema)
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

    // Build document with React.createElement (no JSX — this is a plain .js/CommonJS file)
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
          h(Text, { style: styles.name }, content.personalInfo?.name || 'Resume'),
          h(
            View,
            { style: { flexDirection: 'row', justifyContent: 'space-between' } },
            h(
              View,
              null,
              content.personalInfo?.email ? h(Text, { style: styles.contact }, content.personalInfo.email) : null,
              content.personalInfo?.phone ? h(Text, { style: styles.contact }, content.personalInfo.phone) : null
            ),
            content.personalInfo?.location ? h(Text, { style: styles.contact }, content.personalInfo.location) : null
          )
        ),

        // SUMMARY
        displaySummary
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Summary'),
              h(Text, { style: styles.summaryText }, displaySummary)
            )
          : null,

        // EXPERIENCE
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
                    h(Text, { style: styles.entryTitle }, job.role || 'Position'), // FIX: was job.position
                    h(
                      Text,
                      { style: styles.entryDate },
                      `${formatDate(job.startDate)} - ${job.isCurrent ? 'Present' : formatDate(job.endDate)}` // FIX: was job.isCurrentlyWorking
                    )
                  ),
                  job.company ? h(Text, { style: styles.entrySubtitle }, job.company) : null, // FIX: was job.companyName
                  job.bulletPoints && job.bulletPoints.length > 0
                    ? h(
                        View,
                        null,
                        ...job.bulletPoints.map((bp, bidx) => {
                          if (!bp) return null;
                          // FIX Bug #2: Apply AI optimization rewrites to bulletPoints
                          // (beforeAfterMap was previously only checked on achievements,
                          // but the parser puts all real content into bulletPoints).
                          const displayBp = beforeAfterMap[bp] || bp;
                          return h(
                            View,
                            { key: bidx, style: styles.bulletPoint },
                            h(Text, { style: styles.bullet }, '•'),
                            h(Text, { style: styles.bulletText }, displayBp)
                          );
                        })
                      )
                    : null,
                  job.achievements && Array.isArray(job.achievements) && job.achievements.length > 0
                    ? h(
                        View,
                        null,
                        ...job.achievements.map((achievement, aidx) => {
                          const text = achievement?.description || ''; // FIX: achievements are {description, metrics} objects, not plain strings
                          const displayAchievement = beforeAfterMap[text] || text;
                          return displayAchievement
                            ? h(
                                View,
                                { key: aidx, style: styles.bulletPoint },
                                h(Text, { style: styles.bullet }, '•'),
                                h(Text, { style: styles.bulletText }, displayAchievement)
                              )
                            : null;
                        })
                      )
                    : null
                )
              )
            )
          : null,

        // EDUCATION
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
                    h(Text, { style: styles.entryDate }, edu.endYear || '') // FIX: was edu.graduationYear
                  ),
                  edu.institution ? h(Text, { style: styles.entrySubtitle }, edu.institution) : null, // FIX: was edu.university
                  edu.field ? h(Text, { style: styles.summaryText }, `Field: ${edu.field}`) : null
                )
              )
            )
          : null,

        // SKILLS
        content.skills && content.skills.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Skills'),
              h(
                View,
                { style: styles.skillsContainer },
                ...content.skills.map((skill, idx) =>
                  skill ? h(Text, { key: idx, style: styles.skillBadge }, skill) : null
                )
              )
            )
          : null,

        // CERTIFICATIONS
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
                  cert.issuer ? h(Text, { style: styles.entrySubtitle }, `Issued by: ${cert.issuer}`) : null,
                  cert.date ? h(Text, { style: styles.entryDate }, `Issued: ${formatDate(cert.date)}`) : null // FIX: was cert.issueDate
                )
              )
            )
          : null,

        // PROJECTS
        content.projects && content.projects.length > 0
          ? h(
              View,
              null,
              h(Text, { style: styles.sectionTitle }, 'Projects'),
              ...content.projects.map((proj, idx) =>
                h(
                  View,
                  { key: idx, style: styles.entryContainer },
                  h(Text, { style: styles.entryTitle }, proj.name || 'Project'), // FIX: was proj.title
                  proj.description ? h(Text, { style: styles.summaryText }, proj.description) : null,
                  proj.technologies && proj.technologies.length > 0
                    ? h(Text, { style: styles.entrySubtitle }, `Tech: ${proj.technologies.join(', ')}`)
                    : null
                )
              )
            )
          : null
      )
    );

    // FIX Bug #1: pdf(doc).toBuffer() resolves directly to a Buffer — it is
    // NOT a readable stream. Calling .on('data') on a Buffer throws
    // "TypeError: stream.on is not a function" and crashes every download.
    const buffer = await pdf(doc).toBuffer();
    return buffer;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

module.exports = { generateResumePDFBuffer };